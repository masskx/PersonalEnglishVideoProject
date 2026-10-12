"""Local review server with byte-range support for seeking between video versions."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re

class Handler(SimpleHTTPRequestHandler):
    def send_head(self):
        self.remaining=None
        file=Path(self.translate_path(self.path))
        header=self.headers.get('Range')
        if not header or not file.is_file():
            return super().send_head()
        match=re.fullmatch(r'bytes=(\d*)-(\d*)',header)
        size=file.stat().st_size
        if not match or not any(match.groups()):
            self.send_error(416);return None
        a,b=match.groups()
        start=int(a) if a else max(0,size-int(b))
        end=min(size-1,int(b)) if a and b else size-1
        if start>end or start>=size:
            self.send_error(416);return None
        stream=file.open('rb');stream.seek(start)
        self.remaining=end-start+1
        self.send_response(206)
        self.send_header('Content-Type',self.guess_type(str(file)))
        self.send_header('Accept-Ranges','bytes')
        self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length',str(self.remaining))
        self.end_headers();return stream
    def copyfile(self,source,output):
        if self.remaining is None:return super().copyfile(source,output)
        try:
            while self.remaining:
                data=source.read(min(65536,self.remaining))
                if not data:break
                output.write(data);self.remaining-=len(data)
        except (BrokenPipeError,ConnectionResetError):pass

ThreadingHTTPServer(('127.0.0.1',8767),Handler).serve_forever()
