# Open the file and try to decode using common Chinese encodings
with open('CharFreq.txt', 'rb') as file:
    data = file.read()


out = open('decoded.txt', mode='w') 
# Try to decode with different encodings
encodings = ['gb2312', 'gbk', 'big5', 'utf-8']
for encoding in encodings:
    try:
        decoded_text = data.decode(encoding)
        print(decoded_text,file = out)
    except UnicodeDecodeError:
        print(f"Failed to decode with {encoding}")

