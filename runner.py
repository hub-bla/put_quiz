import subprocess
import os

DEFAULT_PROXY_PATH = os.path.join("proxy", "websockify")
DEFAULT_FRONTEND_PATH = os.path.join("proxy", "websockify")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def parse_config() -> dict:
    with open("config.txt") as f:
        data = f.readlines()

    data = [line.strip().split(":") for line in data]
    print(data)
    config = {key: val for key, val in data}
    return config


def init_submodules(config: dict, path=DEFAULT_PROXY_PATH) -> None:
    target = os.path.join(BASE_DIR, path)
    command = "git submodule update --init --recursive"
    call = subprocess.run(
        command, shell=True, capture_output=True, text=True, cwd=target
    )
    print(call.stderr)


def init_npm(config: dict, path=DEFAULT_FRONTEND_PATH) -> None:
    pass


def run_proxy(config: dict, path=DEFAULT_PROXY_PATH) -> None:
    pass


def run_frontend(config: dict, path=DEFAULT_FRONTEND_PATH) -> None:
    pass


def main():
    config = parse_config()
    init_submodules(config)


if __name__ == "__main__":
    main()
