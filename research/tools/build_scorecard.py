#!/usr/bin/env python3
"""Generate research/09-scorecard.md from research/scores.json.

scores.json is a list of objects:
  {"n": 1, "name": "...", "cluster": "A", "file": "01-agriculture-rural.md",
   "pain": 4, "solo": 4, "ai": 3, "gap": 3, "wtp": 3, "reach": 3,
   "arpu_eur": 40, "mvp_weeks": 8, "verdict": "..."}
Total = sum of the six criteria (max 30).
"""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
ideas = json.loads((ROOT / "scores.json").read_text())
CRIT = ["pain", "solo", "ai", "gap", "wtp", "reach"]
for i in ideas:
    i["total"] = sum(i[c] for c in CRIT)
    i["to5k"] = round(5000 / i["arpu_eur"]) if i["arpu_eur"] else None
    i["to10k"] = round(10000 / i["arpu_eur"]) if i["arpu_eur"] else None

CLUSTERS = {
    "A": "Agriculture, rural & land",
    "B": "Trades, field service & property",
    "C": "Developer & technical tools",
    "D": "Compliance, finance, legal & HR admin",
    "E": "Marketing, sales & content",
    "F": "Vertical SaaS: health, education, hospitality, associations",
    "H": "Sports and athletics",
    "I": "Short-term rental industry",
    "J": "Healthcare staffing",
    "K": "Golf industry",
    "L": "Healthcare workforce planning",
}

def gh_slug(text):
    """Mimic GitHub's heading anchor: lowercase, drop punctuation except spaces and hyphens, spaces to hyphens."""
    text = text.lower()
    text = "".join(ch for ch in text if ch.isalnum() or ch in " -")
    return text.replace(" ", "-")

def link(i):
    return f"[{i['n']}. {i['name']}]({i['file']}#{gh_slug(str(i['n']) + '. ' + i['name'])})"

out = []
out.append(f"# 09 — Scorecard: all {len(ideas)} ideas\n")
out.append("Six criteria, each 1–5, summed to a score out of 30. Definitions are in [00-overview.md](00-overview.md#4-scoring-framework). "
           "ARPU is the realistic average monthly revenue per customer in US dollars used in that idea's path-to-profitability section; "
           "\"to $5k\" / \"to $10k\" is the number of paying customers needed at that ARPU. MVP weeks are solo-developer weeks with AI assistance, "
           "build only (see [07-building-with-ai.md](07-building-with-ai.md#3-the-generic-mvp-playbook-12-weeks)).\n")

out.append("## Ranked by total score\n")
out.append("| Rank | Idea | Cluster | Pain | Solo | AI | Gap | WTP | Reach | **Total** | ARPU $ | to $5k | to $10k | MVP wks |")
out.append("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|")
for rank, i in enumerate(sorted(ideas, key=lambda x: (-x["total"], x["n"])), 1):
    out.append(f"| {rank} | {link(i)} | {i['cluster']} | {i['pain']} | {i['solo']} | {i['ai']} | {i['gap']} | {i['wtp']} | {i['reach']} | **{i['total']}** | {i['arpu_eur']} | {i['to5k']} | {i['to10k']} | {i['mvp_weeks']} |")

out.append("\n## By cluster\n")
for c, cname in CLUSTERS.items():
    out.append(f"### {c} — {cname}\n")
    out.append("| # | Idea | Total | ARPU $ | to $10k | MVP wks | Verdict |")
    out.append("|---|---|---|---|---|---|---|")
    for i in sorted([x for x in ideas if x["cluster"] == c], key=lambda x: x["n"]):
        out.append(f"| {i['n']} | {link(i)} | **{i['total']}** | {i['arpu_eur']} | {i['to10k']} | {i['mvp_weeks']} | {i['verdict']} |")
    out.append("")

out.append("## Distribution of scores\n")
buckets = {}
for i in ideas:
    b = "25–30" if i["total"] >= 25 else "21–24" if i["total"] >= 21 else "17–20" if i["total"] >= 17 else "≤16"
    buckets.setdefault(b, []).append(i["n"])
for b in ["25–30", "21–24", "17–20", "≤16"]:
    ns = buckets.get(b, [])
    out.append(f"- **{b}**: {len(ns)} ideas ({', '.join(map(str, sorted(ns)))})")

(ROOT / "09-scorecard.md").write_text("\n".join(out) + "\n")
print(f"wrote 09-scorecard.md with {len(ideas)} ideas")
