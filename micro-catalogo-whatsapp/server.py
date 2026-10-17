import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class AntiCacheHTTPHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Evitar cache en celulares para ver cambios en tiempo real
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Log conciso
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")

if __name__ == '__main__':
    server = ThreadingHTTPServer(('0.0.0.0', PORT), AntiCacheHTTPHandler)
    server.daemon_threads = True
    print(f"TiendaZap Multi-Threaded Server running on http://0.0.0.0:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
