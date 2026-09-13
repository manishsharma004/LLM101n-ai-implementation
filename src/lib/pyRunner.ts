export const RUNNER_PROGRAM = String.raw`
import io, contextlib, traceback

def run_snippet(code):
    ns = {}
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            exec(compile(code, '<micrograd-lab>', 'exec'), ns)
    except Exception:
        buf.write(traceback.format_exc())
    return buf.getvalue().rstrip('\n')
`
