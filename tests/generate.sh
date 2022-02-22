echo >> src/lib.rs
for doc in ../src/*.md
do
    NAME=$(basename $doc .md)
    NAME=${NAME//./_}
    NAME=${NAME//-/_}
    echo -e "doctest\041(\"../$doc\");" > src/$NAME.rs
    echo "mod $NAME;" >> src/lib.rs
done
