FROM openwa/wa-automate:latest
USER 0
RUN mkdir /chuck
RUN chmod 777 /chuck
WORKDIR /chuck
USER 1000
ENTRYPOINT node chuckbot.js