#!/usr/bin/env python3
"""Inject ideas.json into the artifact template and write the scorecard HTML to the given output path."""
import json, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "scorecard.html"
tpl = (ROOT / "tools" / "artifact_template.html").read_text()
data = json.dumps(json.loads((ROOT / "ideas.json").read_text()), ensure_ascii=False)
html = tpl.replace("/*DATA*/[]/*END*/", data)
out.write_text(html)
print(f"wrote {out} ({len(html)//1024} KB)")
