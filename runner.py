import subprocess
import os
import atexit
import webbrowser
import signal

DEFAULT_PROXY_PATH = os.path.join("proxy", "websockify")
DEFAULT_FRONTEND_PATH = os.path.join("frontend")
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

    subprocess.run(command, shell=True, capture_output=True, text=True, cwd=BASE_DIR)

    print("Done")


def init_npm(path=DEFAULT_FRONTEND_PATH) -> None:
    print("Initializing npm...", end=" ")
    command = "npm install"
    target = os.path.join(BASE_DIR, path)

    subprocess.run(command, shell=True, capture_output=True, text=True, cwd=target)

    print("Done")


def run_proxy(config: dict, path=DEFAULT_PROXY_PATH) -> subprocess.Popen:
    print("Starting proxy...", end=" ")
    command = f"./run {config['target']} {config['addr']}:{config['port']}".split()
    target = os.path.join(BASE_DIR, path)

    background_process = subprocess.Popen(
        command,
        shell=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        cwd=target,
    )

    print("Done")
    return background_process


def run_frontend(path=DEFAULT_FRONTEND_PATH) -> None:
    print("Starting frontend...", end=" ")

    command = "npm run build"
    target = os.path.join(BASE_DIR, path)
    subprocess.run(command, shell=True, capture_output=True, text=True, cwd=target)

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
    proxy_process = None
    frontend_process = None

    atexit.register(terminate_subprocesses, [proxy_process, frontend_process])
    config = parse_config()
    init_submodules()
    init_npm()
    proxy_process = run_proxy(config)
    frontend_process = run_frontend()
    signal.pause()


if __name__ == "__main__":
    main()
