#!/usr/bin/env python3
"""Merge scores.json with each idea's one-liner from the chapter files into ideas.json (for the artifact)."""
import json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1]
ideas = json.loads((ROOT / "scores.json").read_text())
oneliners = {}
for md in list(ROOT.glob("0[1-6]-*.md")) + list(ROOT.glob("1[0-2]-*.md")):
    text = md.read_text()
    for m in re.finditer(r"^## (\d+)\. .*?\n\n\*\*One-liner\.\*\* (.*?)\n", text, re.M | re.S):
        oneliners[int(m.group(1))] = m.group(2).strip()
for i in ideas:
    i["oneliner"] = oneliners.get(i["n"], "")
    i["total"] = i["pain"] + i["solo"] + i["ai"] + i["gap"] + i["wtp"] + i["reach"]
missing = [i["n"] for i in ideas if not i["oneliner"]]
(ROOT / "ideas.json").write_text(json.dumps(ideas, indent=1, ensure_ascii=False) + "\n")
print(f"{len(ideas)} ideas, missing one-liners: {missing}")
