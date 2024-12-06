FROM opensuse/leap

# probably need to expose port (some .env file with host and container port would be also needed)
RUN zypper -n refresh

RUN zypper -n update

RUN zypper -n install gcc-c++ make cmake clang git

COPY ./server ./server

WORKDIR server

CMD ["./scripts/bash/build_in_docker.sh"]
