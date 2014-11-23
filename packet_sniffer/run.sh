#!/bin/bash
PIPE_NAME=packet_pipe
mkfifo $PIPE_NAME
python pcapreader.py $PIPE_NAME &
READER_PID=$!
tcpdump -nnvs0 -I -i en0 -w $PIPE_NAME -U
kill $READER_PID
rm $PIPE_NAME