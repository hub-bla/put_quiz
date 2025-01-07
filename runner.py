import subprocess
import os
import atexit
import signal

DEFAULT_PROXY_PATH = os.path.join("proxy", "websockify")
DEFAULT_FRONTEND_PATH = os.path.join("frontend")
DEFAULT_FRONTEND_CONFIG_PATH = os.path.join(
    "frontend", "src", "utils", "constants", "socket.ts"
)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def terminate_subprocesses(procceses) -> None:
    print("Terminating subprocesses...", end=" ")
    for procces in procceses:
        if procces == None:
            continue
        procces.terminate()
    print("Goodbye!")


def parse_config() -> dict:
    with open("config.txt") as f:
        data = f.readlines()

    data = [line.strip().split(":") for line in data]
    config = {key: val for key, val in data}
    return config


def init_submodules() -> None:
    print("Initializing submodules...", end=" ")
    command = "git submodule update --init --recursive"

    process = subprocess.Popen(
        command,
        shell=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        cwd=BASE_DIR,
    )

    process.wait()

    print("Done")


def init_npm(path=DEFAULT_FRONTEND_PATH) -> None:
    print("Initializing npm...", end=" ")
    command = "npm install"
    target = os.path.join(BASE_DIR, path)

    process = subprocess.Popen(
        command,
        shell=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        cwd=target,
    )

    process.wait()
    print("Done")


def make_config(config: dict, path=DEFAULT_FRONTEND_CONFIG_PATH) -> None:
    print("Making config...", end=" ")
    with open(path, "w") as f:
        f.write(f"export const SERVER_URL = 'ws://localhost:{config['target']}';")

    print("Done")


def run_proxy(config: dict, path=DEFAULT_PROXY_PATH) -> subprocess.Popen:
    print("Starting proxy...", end=" ")
    exec_path = os.path.join(BASE_DIR, path, "run")
    args = [config["target"], f"{config['addr']}:{config['port']}"]

    target = os.path.join(BASE_DIR, path)

    background_process = subprocess.Popen(
        [exec_path] + args,
        shell=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        cwd=target,
    )
    for line in iter(background_process.stderr.readline, ""):
        if "proxying" in str(line):
            print(line.strip())
            break

    return background_process


def run_frontend(path=DEFAULT_FRONTEND_PATH) -> None:
    print("Starting frontend...", end=" ")

    command = "npm run build"
    target = os.path.join(BASE_DIR, path)

    process = subprocess.Popen(
        command,
        shell=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        cwd=target,
    )

    process.wait()

    command = "npm run preview"
    target = os.path.join(BASE_DIR, path)

    background_process = subprocess.Popen(
        command,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
        text=True,
        cwd=target,
    )
    for line in iter(background_process.stdout.readline, ""):
        if "localhost" in str(line):
            print(line.strip())
            break
    return background_process


def main():

    config = parse_config()
    make_config(config)

    init_submodules()
    init_npm()
    proxy_process = run_proxy(config)
    frontend_process = run_frontend()

    atexit.register(terminate_subprocesses, [proxy_process, frontend_process])

    print("Press Ctrl+C to exit")
    signal.pause()


if __name__ == "__main__":
    main()
