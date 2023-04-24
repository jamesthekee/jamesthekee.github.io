import json

unigrams = []

with open("interactive/unigram/large_unigram.txt", mode="r") as f:
    t = f.read().splitlines()
    for i in t:
        gram, count = i.split("\t")
        count = int(count)
        unigrams.append((gram, count))

x = {
    "unigrams":unigrams
}

y=json.dumps(x)
with open("interactive/large_unigram.json", mode="w") as f:
    f.write(y)