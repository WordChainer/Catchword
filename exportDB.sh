#!/bin/bash

mongoexport -d admin -c words -f value -q='{ "length": 3 }' --sort='{ value: 1 }' --noHeaderLine --type=csv -o words.txt
mongoexport -d admin -c words -f value -q='{ "length": 2 }' --sort='{ value: 1 }' --noHeaderLine --type=csv -o words2.txt
