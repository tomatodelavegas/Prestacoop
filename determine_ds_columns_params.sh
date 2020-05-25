#!/bin/bash
# usage: bash determine_ds_columns_params.sh nyc/*.csv

unset COLUMNS

for FILE in $@
do
    CCUR=$(cat $FILE | head -n 1)
    CCUR=$(sed 's/,/\\n/g' <<< $CCUR)
    if [ -z "$COLUMNS" ]
    then
        COLUMNS=$(echo -e "$CCUR" | sort -u)
    else
        COLUMNS=$(echo -e "$COLUMNS\n$CCUR" | sort -u)
    fi
    echo "new" $(echo -e "$CCUR" | wc -l) "columns in CSV $FILE"
done

echo "new" $(echo -e "$COLUMNS" | wc -l) "columns"
echo -e "$COLUMNS"