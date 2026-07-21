#!/usr/bin/env python3
"""Brief Studio collector — 표준 라이브러리만 사용.

사용: python brief-studio-server.py [port]  (기본 8960, 스튜디오 HTML이 있는 폴더에서 실행)
- GET  /            : 폴더 정적 서빙 (brief-studio.html 포함)
- POST /select      : 선택 JSON 수신 → ./brief-selections.json 저장 + stdout 출력
에이전트는 brief-selections.json 생성을 폴링해 선택을 읽는다.
"""
import json
import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer


class Handler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/select":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_error(400, "invalid json")
            return
        with open("brief-selections.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("SELECTIONS RECEIVED:", json.dumps(data, ensure_ascii=False), flush=True)
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"ok": true}')

    def log_message(self, *args):  # 조용히
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8960
    print(f"brief studio: http://localhost:{port}/brief-studio.html", flush=True)
    HTTPServer(("127.0.0.1", port), Handler).serve_forever()
