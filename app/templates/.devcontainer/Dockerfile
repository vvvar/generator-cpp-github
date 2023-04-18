FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC

RUN apt-get update -y
RUN apt-get install -y ca-certificates software-properties-common
RUN apt-get install -y git cmake wget python3 ninja-build
RUN wget -O - https://apt.llvm.org/llvm-snapshot.gpg.key | apt-key add -
RUN apt-get update --allow-insecure-repositories
RUN apt-get install -y gcc-8 g++-8
RUN apt-get install -y clang-15 lldb-15 lld-15
RUN pip3 install conan==<%= ConanVersion %>