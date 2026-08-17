from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.request import Request, urlopen

CALENDAR_URL = (
    "https://p171-caldav.icloud.com/published/2/"
    "MTAxMjE1MDk0NTcxMDEyMZDaRHGaM8MBdB321y-X7U9byRkXosGZngYN_p9nIr_ZbJegGYZYgVq2fnS6b_lKzqd8go7riXsHrVdtz5Mpg3w"
)


class SchoolHubHandler(SimpleHTTPRequestHandler):

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def do_GET(self):
        if self.path == "/school-calendar":
            try:
                request = Request(
                    CALENDAR_URL,
                    headers={
                        "User-Agent": "SchoolHub/1.0"
                    }
                )

                with urlopen(request, timeout=15) as response:
                    calendar_data = response.read()

                self.send_response(200)
                self.send_header(
                    "Content-Type",
                    "text/calendar; charset=utf-8"
                )
                self.send_header(
                    "Content-Length",
                    str(len(calendar_data))
                )
                self.end_headers()

                self.wfile.write(calendar_data)

            except Exception as error:
                message = f"Calendar error: {error}".encode("utf-8")

                self.send_response(500)
                self.send_header(
                    "Content-Type",
                    "text/plain; charset=utf-8"
                )
                self.send_header(
                    "Content-Length",
                    str(len(message))
                )
                self.end_headers()

                self.wfile.write(message)

            return

        super().do_GET()


server = ThreadingHTTPServer(
    ("localhost", 8000),
    SchoolHubHandler
)

print("School Hub running at http://localhost:8000")
print("Calendar bridge available at http://localhost:8000/school-calendar")

server.serve_forever()