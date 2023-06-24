if ps auxwww | grep [p]ostgres
then
  echo "Postgres service is running"
  exit 0
else
  echo "You need to start your Postgres service to run this script." >&2
  exit 1
fi

# exit 0