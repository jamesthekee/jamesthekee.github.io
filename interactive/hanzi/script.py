import json

unigrams = []

with open("bigrams.txt", mode="r", encoding="utf8") as f:
    t = f.read().splitlines()
    for i in t:
        result = i.split("\t")
        if len(result ) > 5:
            result[4] = "  ".join(result[4:])
            result = result[:5]
        _, char, count, freq, meaning = result
        count = int(count)
        freq = float(freq)
        unigrams.append((char, count))

x = {
    "unigrams":unigrams
}

y=json.dumps(x)
with open("bigram.json", mode="w", encoding="utf8") as f:
    f.write(y)