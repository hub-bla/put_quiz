![](./lecina.png)

## Init submodules
```
git submodule update --init --recursive
```

## Run websockify

In `put_quiz/proxy/websockify` directory:
```
./run 8080 127.0.0.1:8913
```

## Run frontend
In `put_quiz/frontend` directory:
```
npm i
npm run dev
```

## Run cpp linter
In `put_quiz/server` directory:
```
python3 ./scripts/python/run-clang-format.py -ir src apps include
```
