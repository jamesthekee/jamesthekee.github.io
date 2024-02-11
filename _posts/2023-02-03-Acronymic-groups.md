---
layout: post
title:  Acronymic Groups
date:   2023-02-02 15:52:11 +0000
tags: stats language weird_questions
published: false
---
# Acronymic Groups
The other day I was thinking about a round from the gameshow “Would I lie To You?” where Lee Mack says his he remembers his ex’s names by the acronym BERMUDA. A video clip of the round is available [here](https://www.youtube.com/watch?v=sypQXXN57T8). 

Anyway it got me thinking about the actual probability of being able to form an acronym from the names of your exes. This post is about answering that and some tangential questions, including the specifics of the scenario that Lee Mack describes and more general cases. I do my best to keep the unrelated content in the addendums to keep this short but be warned this is a long post.

- [Acronymic Groups](#acronymic-groups)
  - [Vocabulary](#vocabulary)
  - [Name database](#name-database)
    - [Resulting first letter distribution.](#resulting-first-letter-distribution)
  - [Results](#results)
    - [Most probable words](#most-probable-words)
      - [Boy results and girl results](#boy-results-and-girl-results)
  - [Adjusting for order](#adjusting-for-order)
  - [BERMUDA](#bermuda)
    - [Scenario 1](#scenario-1)
    - [Scenario 2](#scenario-2)
    - [Scenario 3](#scenario-3)
    - [Scenario 4](#scenario-4)
  - [References](#references)
  - [Addendum](#addendum)


## Vocabulary

The first goal was to find a vocabulary of words. Which was surprisingly difficult, many I found (such as nltk.corpus.words) included too many obscure words, like location names, plants, historical tools that will make little sense to the average person. I ended up using this [word list](http://www.mieliestronk.com/wordlist.html), which gave me about 50,000 reasonable words as opposed to the 200,000 I was getting from other sources.

## Name database

First I needed a database of names and their frequencies so that I coud produce a probability distribution of name first letters. For conciseness I'll call these first letter distributions (FLDs). Also I'll define an acronymic group as a collection of individuals whose names, when considering the initial letters, can be arranged to form a word.

I couldn't find many comprehensive lists of names which inncluded frequencies, the best I Found was from the UK census data [here](https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/livebirths/datasets/babynamesinenglandandwalesfrom1996), which is appropriate to answer our question, but obviously won't be if you don't live in the UK or aren't Lee Mack. 

The census data is split by gender (gender assigned from birth) and by year from 1996-2021, which as of writing will include anyone from the age of 2-28. Not quite the right age range for Lee Mack's partners but it'll do. For those curious, I take look into the data more closely in the [addendum](#addendum).

### Resulting first letter distribution.

Here are the produced FLDs, red for girls, green for boys and blue for the combined distribution.

![girls](/assets/images/acronymic/girls_fld.png)

![boys](/assets/images/acronymic/boys_fld.png)

![unisex](/assets/images/acronymic/unisex_fld.png)

These look a little different from the only other FLD I could find online, which is available [here](https://themeaningofthename.com/traffic-and-name-statistics/names-first-letter-distribution/), and shown below. There is noticable difference in some letters like S and A, so if you're concerned with wholly unnecessary accuracy you may see a need for a more representative distribution but I was happy to run with what we have. Some boring analysis for how the distributions have changed over time for each gender are in the [addenum](#addendum).

![other](/assets/images/acronymic/other_fld.png)

## Results

Now that I got the needed data, I could calculate some actual probabilities of getting specific words in an acronymic group. I calculate probabilities, written as **prob**, by simply going through each letter in a word, and multiplying by its probability in the given FLD. This actually corresponds to the situation where we care about some specific ordering on the group, E.G Lee Mack’s case scenario where he says the anagram is in the order of him dating them.

Out of curiousity I decided to calculate two other metrics. **'Normalised'**: which is not actually a normalised probability but is equal to $$\sqrt[n]{prob}$$ which will enable longer words to rank higher, as otherwise our answers may be quite boring. **Poisson:** calculates the probabilty based on the assumption that the average number of exs is 5 using a poisson distribution, so this may represent a more realistic scenario than **prob** which suggest the probabilty of having 1 ex is the same as 5.

Here are the results for all words with each metric, using the unisex FLD, sorted by **prob**. The unfortunate result is that it's just get boring 2 letter words.

```
word      prob  normalised   poisson
  am  0.009912    0.099558  0.000835
  as  0.007465    0.086401  0.000629
  me  0.006445    0.080281  0.000543
  em  0.006445    0.080281  0.000543
  ms  0.005599    0.074825  0.000472
  ah  0.005459    0.073884  0.000460
  ha  0.005459    0.073884  0.000460
  at  0.004511    0.067167  0.000380
  mr  0.004327    0.065782  0.000364
  re  0.003752    0.061251  0.000316
  he  0.003550    0.059578  0.000299
  eh  0.003550    0.059578  0.000299
  an  0.002900    0.053854  0.000244
  im  0.002481    0.049808  0.000209
  be  0.002474    0.049737  0.000208
  pa  0.002036    0.045124  0.000171
  ne  0.001886    0.043427  0.000159
  so  0.001872    0.043268  0.000158
  is  0.001869    0.043226  0.000157
  eg  0.001860    0.043129  0.000157
```


But if I sort by **normalised** it gets a tad more interesting. 

```
both:                                   |     women:                              |           men:

   word    prob  normalised  poisson    |    word    prob  normalised  poisson   	|   word    prob   normalised  poisson 
    ala  9.974e-4    0.0999  1.400e-4   |     ala  0.001435    0.1127  2.014e-4   |     jam  1.089e-3    0.1028  1.528e-4 
     am  9.911e-3    0.0995  8.348e-4   |    mama  0.000151    0.1108  2.652e-5   |    ajar  7.907e-5    0.0943  1.387e-5 
   mama  9.824e-5    0.0995  1.723e-5   |      am  0.012294    0.1108  1.035e-3   |     raj  7.934e-4    0.0925  1.113e-4 
   lama  8.600e-5    0.0963  1.509e-5   |    lama  0.000135    0.1078  2.376e-5   |     jar  7.934e-4    0.0925  1.113e-4 
    jam  8.913e-4    0.0962  1.251e-4   |    ease  0.000130    0.1067  2.282e-5   |      am  7.779e-3    0.0882  6.552e-4 
 salaam  6.420e-7    0.0928  9.387e-8   |     lea  0.001213    0.1066  1.702e-4   |    mama  6.051e-5    0.0882  1.061e-5 
 mammal  6.393e-7    0.0928  9.348e-8   |     ale  0.001213    0.1066  1.702e-4   |     ala  6.591e-4    0.0870  9.253e-5 
  llama  6.490e-6    0.0917  1.138e-6   |  salaam  0.000001    0.1064  2.126e-7   |    jarl  5.265e-5    0.0851  9.238e-6 
  mamas  6.379e-6    0.0914  1.119e-6   |     sea  0.001182    0.1057  1.658e-4   |    jams  5.168e-5    0.0847  9.069e-6 
    lam  7.480e-4    0.0907  1.050e-4   |   mamas  0.000012    0.1044  2.185e-6   |    lama  5.145e-5    0.0846  9.028e-6 
   alas  6.477e-5    0.0897  1.136e-5   |    alas  0.000118    0.1042  2.075e-5   |   rajah  4.155e-6    0.0838  7.290e-7 
  lamas  5.584e-6    0.0890  9.799e-7   |      as  0.010734    0.1036  9.041e-4   |     jab  5.814e-4    0.0834  8.162e-5 
mammals  4.151e-8    0.0881  4.336e-9   |    male  0.000114    0.1034  2.008e-5   |  mammal  3.134e-7    0.0824  4.583e-8 
   ajar  5.964e-5    0.0878  1.046e-5   |    meal  0.000114    0.1034  2.008e-5   |    jamb  4.538e-5    0.0820  7.963e-6 
   jams  5.788e-5    0.0872  1.015e-5   |    lame  0.000114    0.1034  2.008e-5   |    mara  4.409e-5    0.0814  7.736e-6 
alabama  3.761e-8    0.0869  3.928e-9   |  mammal  0.000001    0.1031  1.764e-7   |   llama  3.414e-6    0.0806  5.991e-7 
   mara  5.718e-5    0.0869  1.003e-5   |    seam  0.000112    0.1027  1.957e-5   |     aha  5.219e-4    0.0805  7.326e-5 
    all  6.548e-4    0.0868  9.192e-5   |    same  0.000112    0.1027  1.957e-5   |     lam  5.162e-4    0.0802  7.246e-5 
   mall  5.646e-5    0.0866  9.907e-6   |   llama  0.000011    0.1027  2.010e-6   | alabama  2.129e-8    0.0801  2.224e-9 
 llamas  4.215e-7    0.0865  6.163e-8   |   lamas  0.000011    0.1022  1.958e-6   |     cam  4.995e-4    0.0793  7.012e-5
```

 Sorting by poisson distributed values actually produces very similar answers to **prob** so for brevity it shall be ignored. But remember these probabilities are all conditional on having a group of size n, so for precise calculations it is necessary to consider the probabilty of that condition.

### Most probable words

The following two tables show the top 20 most probable words grouped by word size. These values have been calculated by the combined unisex FLDs. Gendered results are in the next section. Each table also includes **total_prob** which is the total summed probabilities over all words of word length **K**. **N** is the total number of words we have of length **K.** in the vocabulary.
    

```
2-word    prob      3-word      prob         4-word      prob       5-word      prob
    am  0.009912       ala  0.000997           mama  0.000098        llama  0.000006
    as  0.007465       jam  0.000891           lama  0.000086        mamas  0.000006
    me  0.006445       lam  0.000748           alas  0.000065        lamas  0.000006
    em  0.006445       all  0.000655           ajar  0.000060        lemma  0.000005
    ms  0.005599       lea  0.000649           jams  0.000058        amass  0.000005
    ha  0.005459       ale  0.000649           mara  0.000057        james  0.000004
    ah  0.005459       sam  0.000644           mall  0.000056        alarm  0.000004
    at  0.004511       mas  0.000644           lame  0.000056        salsa  0.000004
    mr  0.004327       aha  0.000628           male  0.000056        areal  0.000004
    re  0.003752       cam  0.000623           meal  0.000056        small  0.000004
    eh  0.003550       mac  0.000623           area  0.000050        malls  0.000004
    he  0.003550       las  0.000563           elal  0.000049        meals  0.000004
    an  0.002900       sea  0.000558           slam  0.000049        males  0.000004
    im  0.002481       ace  0.000540           alms  0.000049        salem  0.000004
    be  0.002474       raj  0.000519           seam  0.000048        camel  0.000004
    pa  0.002036       jar  0.000519           same  0.000048        madam  0.000003
    ne  0.001886       ram  0.000497           clam  0.000047        malta  0.000003
    so  0.001872       arm  0.000497           calm  0.000047        mamba  0.000003
    is  0.001869       mar  0.000497           mace  0.000047        areas  0.000003
    eg  0.001860       elm  0.000486           came  0.000047        slams  0.000003
                          
total_prob = 0.1036    total_prob = 0.05914    total_prob = 0.01355   total_prob = 0.001317
N = 47                 N = 589                 N = 2294               N = 4266
```

```
 6-word      prob         7-word      prob           8-word     prob
 salaam  6.420e-7        mammals  4.151e-8         mammalia  2.114e-9
 mammal  6.393e-7        alabama  3.761e-8         caracals  1.475e-9
 llamas  4.215e-7        marsala  3.222e-8         amalgams  1.377e-9
 lemmas  3.130e-7        mascara  2.682e-8         caramels  1.316e-9
 alaska  2.810e-7        amasses  2.332e-8         seamless  1.144e-9
 alarms  2.802e-7        caracal  2.271e-8         massacre  1.132e-9
 allele  2.761e-7        jamaica  2.129e-8         malarial  1.077e-9
 camera  2.685e-7        amalgam  2.121e-8         alacarte  1.060e-9
 madame  2.547e-7        mahatma  2.104e-8         almanacs  1.017e-9
 smalls  2.380e-7        caramel  2.027e-8         massless  9.943e-10
 sahara  2.351e-7        cascara  1.954e-8         sarcasms  9.839e-10
 sesame  2.335e-7        alleles  1.793e-8         saleable  9.040e-10
 camels  2.281e-7        measles  1.762e-8         escalate  8.924e-10
 armada  2.280e-7        cameras  1.744e-8         callable  8.831e-10
 madams  2.212e-7        almanac  1.567e-8         marshals  8.642e-10
 jackal  2.127e-7        sarcasm  1.515e-8         teammate  8.454e-10
 mambas  2.111e-7        armadas  1.480e-8         carcases  8.253e-10
 pajama  2.086e-7        malaria  1.427e-8         escalade  7.887e-10
 leases  2.044e-7        lacteal  1.387e-8         releases  7.670e-10
 easels  2.044e-7        academe  1.387e-8         scalable  7.598e-10
                
total_prob = 0.0001057   total_prob = 6.781e-6     total_prob = 3.3527e-7
N = 6936                 N = 9203                  N = 9396
```



#### Boy results and girl results

The next 7 tables contains the gendered results, with boy results  on the left and girl results are on the right. [Click here to skip to the next section](#adjusting-for-order)

```
word      prob      word      prob
  am  0.007779        am  0.012294
  at  0.005563        as  0.010734
  ah  0.005237        me  0.010390
  ha  0.005237        em  0.010390
  as  0.004730        ms  0.007778
  mr  0.004439        ha  0.005526
  ms  0.003705        ah  0.005526
  em  0.003077        re  0.004790
  me  0.003077        eh  0.004671
  dr  0.002578        he  0.004671
  an  0.002247        mr  0.004107
  re  0.002242        im  0.004039
  or  0.002146        an  0.003635
  to  0.002106        is  0.003526
  he  0.002071        pa  0.003396
  eh  0.002071        eg  0.003096
  ho  0.001982        ne  0.003072
  oh  0.001982        at  0.002954
  so  0.001791        be  0.002698
  do  0.001710        hi  0.001816
      
0.08247               0.1251
47                    47
```

```
word      prob      word      prob
 jam  0.001089       ala  0.001435
 jar  0.000793       lea  0.001213
 raj  0.000793       ale  0.001213
 ala  0.000659       sea  0.001182
 jab  0.000581       lam  0.001040
 aha  0.000522       eel  0.001025
 lam  0.000516       lee  0.001025
 mac  0.000500       sam  0.001013
 cam  0.000500       mas  0.001013
 mar  0.000442       see  0.000999
 arm  0.000442       all  0.000932
 ram  0.000442       las  0.000908
 all  0.000439       ass  0.000885
 mat  0.000434       ace  0.000881
 baa  0.000414       elm  0.000879
 ham  0.000409       ems  0.000856
 sam  0.000369       ell  0.000788
 mas  0.000369       els  0.000767
 alt  0.000369       cam  0.000755
 car  0.000364       mac  0.000755
      
0.04779              0.07190
589                  589
```

```
word       prob      word      prob
 ajar  0.000079      mama  0.000151
 mama  0.000061      lama  0.000135
 jarl  0.000053      ease  0.000130
 jams  0.000052      alas  0.000118
 lama  0.000051      meal  0.000114
 jamb  0.000045      male  0.000114
 mara  0.000044      lame  0.000114
 jars  0.000038      seam  0.000112
 taal  0.000037      same  0.000112
 adam  0.000035      elal  0.000103
 mall  0.000034      seal  0.000100
 calm  0.000033      lase  0.000100
 clam  0.000033      ales  0.000100
 alas  0.000031      sale  0.000100
 jack  0.000031      seas  0.000097
 marl  0.000029      seem  0.000094
 malt  0.000029      mall  0.000088
 cram  0.000028      slam  0.000086
 call  0.000028      alms  0.000086
 jabs  0.000028      else  0.000084
      
0.008889             0.01907
2294                 2294
```

```
  word      prob        word      prob
 rajah  0.000004       mamas  0.000012
 llama  0.000003       llama  0.000011
 alarm  0.000003       lamas  0.000011
 mamas  0.000003       lease  0.000011
 malta  0.000003       easel  0.000011
 madam  0.000003       amass  0.000011
 mamba  0.000003       lemma  0.000011
 lamas  0.000002       eases  0.000011
 major  0.000002       melee  0.000011
 accra  0.000002       salsa  0.000010
 jambs  0.000002       meals  0.000009
 altar  0.000002       salem  0.000009
 james  0.000002       males  0.000009
 carat  0.000002       seams  0.000009
 drama  0.000002       seals  0.000008
 cabal  0.000002       sales  0.000008
 amass  0.000002       asses  0.000008
 atlas  0.000002       cease  0.000008
 aroma  0.000002       seems  0.000008
 small  0.000002       small  0.000007
      
0.0007172              0.002118
4266                   4266
```

```
word        prob      word        prob
mammal  3.134e-7      salaam  1.454e-6
salaam  2.433e-7      mammal  1.206e-6
jackal  2.049e-7      sesame  1.011e-6
armada  1.991e-7      allele  9.554e-7
ararat  1.787e-7      llamas  9.443e-7
llamas  1.620e-7      leases  9.068e-7
tarmac  1.580e-7      easels  9.068e-7
jammed  1.518e-7      lemmas  8.904e-7
sahara  1.404e-7      lessee  7.664e-7
alarms  1.388e-7      masses  7.575e-7
madams  1.301e-7      lasses  6.788e-7
mambas  1.197e-7      assess  6.614e-7
scalar  1.142e-7      ceases  6.587e-7
sacral  1.142e-7      messes  6.401e-7
rascal  1.142e-7      alaska  6.303e-7
jetsam  1.137e-7      smalls  5.974e-7
chacha  1.130e-7      camels  5.797e-7
camera  1.116e-7      mealie  5.392e-7
majors  1.109e-7      miasma  5.330e-7
amoral  1.103e-7      scales  5.061e-7
      
5.0354e-5             0.0001829
6936                  6936
```


```
    word         prob         word          prob
 alabama  2.129e-8      mammals  9.944e-8
 mahatma  1.768e-8      amasses  9.866e-8
 caracal  1.540e-8      measles  8.559e-8
 jakarta  1.521e-8      alleles  7.873e-8
 mammals  1.487e-8      marsala  6.326e-8
 marsala  1.384e-8      lessees  6.316e-8
 mascara  1.339e-8      alabama  5.633e-8
 cascara  1.102e-8      release  5.270e-8
 jamaica  1.025e-8      seamail  5.258e-8
 jackals  9.726e-9      malaise  5.258e-8
 abraham  9.623e-9      amalgam  4.683e-8
 armadas  9.453e-9      mascara  4.595e-8
 tramcar  8.987e-9      aliases  4.591e-8
 mallard  8.800e-9      mealies  4.444e-8
 amalgam  8.664e-9      siamese  4.329e-8
 bahamas  8.031e-9      classes  4.171e-8
 almanac  7.424e-9      caramel  3.986e-8
 caramel  7.406e-9      sealers  3.945e-8
 marshal  7.296e-9      salamis  3.936e-8
 jackass  6.956e-9      cameras  3.883e-8
      
2.7493e-6                  1.3193e-5
9203                       9203
```

```
     word       prob           word      prob
 caracals  7.312e-10       seamless  7.053e-9
 cataract  7.232e-10       mammalia  6.726e-9
 baccarat  5.400e-10       assesses  6.000e-9
 alacarte  5.278e-10       massless  5.280e-9
 catcalls  4.778e-10       releases  4.343e-9
 mammalia  4.610e-10       amalgams  3.859e-9
 tramcars  4.265e-10       accesses  3.335e-9
 mallards  4.176e-10       caramels  3.285e-9
 amalgams  4.112e-10       massacre  3.200e-9
 maltreat  3.592e-10       reassess  3.167e-9
 hallmark  3.528e-10       saleable  2.971e-9
 almanacs  3.524e-10       legalese  2.881e-9
 caramels  3.515e-10       salesman  2.826e-9
 marshals  3.463e-10       malarial  2.778e-9
 drachmas  3.200e-10       massages  2.774e-9
 meatball  3.130e-10       caracals  2.530e-9
 charcoal  3.064e-10       almanacs  2.493e-9
 callable  3.062e-10       rescales  2.424e-9
 balmoral  3.053e-10       careless  2.424e-9
 sarcasms  3.027e-10       sarcasms  2.396e-9
      
1.155e-7                   7.389e-7
9396                       9396
```

## Adjusting for order

Beforehand we calculated the probabilities as if cared about a specific ordering. But we may not care about that, and it may vastly increase the probabilities from improbable to basically improbable. We can calculate this by multiplying the existing probabilities by the number of distinct permutations of the letters of the given word, considering there can be duplicate letters. The specific formula needed for this is the [multinomial coefficient](https://en.wikipedia.org/wiki/Multinomial_theorem) formula: 

$$\binom{n}{k_1,...,k_m} = \frac{n!}{k_1!.k_2!.....k_m!}$$


where $$n$$ is the total number of letters and $$k_1, ... k_{26}$$ is the frequency of each letter in the alphabet in the word.

Anyway here are the values in tables, once again we show the top 20 words sorted by unordered_prob and left corresponds as using the male FLD and right as the female FLD.

```
word      prob  unordered_prob    word      prob  unordered_prob
  am  0.007779        0.015559      am  0.012294        0.024588 
  at  0.005563        0.011125      as  0.010734        0.021469 
  ah  0.005237        0.010474      me  0.010390        0.020780 
  ha  0.005237        0.010474      em  0.010390        0.020780 
  as  0.004730        0.009461      ms  0.007778        0.015557 
  mr  0.004439        0.008878      ha  0.005526        0.011053 
  ms  0.003705        0.007409      ah  0.005526        0.011053 
  em  0.003077        0.006154      re  0.004790        0.009579 
  me  0.003077        0.006154      eh  0.004671        0.009341 
  dr  0.002578        0.005155      he  0.004671        0.009341 
  an  0.002247        0.004494      mr  0.004107        0.008213 
  re  0.002242        0.004484      im  0.004039        0.008078 
  or  0.002146        0.004291     lea  0.001213        0.007278 
  to  0.002106        0.004211     ale  0.001213        0.007278 
  he  0.002071        0.004142      an  0.003635        0.007271 
  eh  0.002071        0.004142     sea  0.001182        0.007090 
  ho  0.001982        0.003965      is  0.003526        0.007053 
  oh  0.001982        0.003965      pa  0.003396        0.006791 
  so  0.001791        0.003581     lam  0.001040        0.006240 
  do  0.001710        0.003420      eg  0.003096        0.006191

```


```
word      prob  unordered_prob    word      prob  unordered_prob
 jam  0.001089        0.006534     lea  0.001213        0.007278
 jar  0.000793        0.004761     ale  0.001213        0.007278
 raj  0.000793        0.004761     sea  0.001182        0.007090
 jab  0.000581        0.003489     lam  0.001040        0.006240
 lam  0.000516        0.003097     sam  0.001013        0.006079
 mac  0.000500        0.002997     mas  0.001013        0.006079
 cam  0.000500        0.002997     las  0.000908        0.005448
 ram  0.000442        0.002654     ace  0.000881        0.005286
 mar  0.000442        0.002654     elm  0.000879        0.005273
 arm  0.000442        0.002654     ems  0.000856        0.005138
 mat  0.000434        0.002605     els  0.000767        0.004605
 ham  0.000409        0.002452     cam  0.000755        0.004532
 sam  0.000369        0.002215     mac  0.000755        0.004532
 mas  0.000369        0.002215     ala  0.001435        0.004306
 alt  0.000369        0.002215     sac  0.000660        0.003957
 arc  0.000364        0.002184     are  0.000624        0.003743
 car  0.000364        0.002184     ear  0.000624        0.003743
 cat  0.000357        0.002143     era  0.000624        0.003743
 act  0.000357        0.002143     sec  0.000557        0.003345
 dam  0.000353        0.002116     ram  0.000535        0.003209
```

```
 word      prob  unordered_prob    word      prob  unordered_prob
 jarl  0.000053        0.001264    meal  0.000114        0.002748
 jams  0.000052        0.001240    male  0.000114        0.002748
 jamb  0.000045        0.001089    lame  0.000114        0.002748
 ajar  0.000079        0.000949    same  0.000112        0.002677
 jars  0.000038        0.000904    seam  0.000112        0.002677
 clam  0.000033        0.000796    seal  0.000100        0.002399
 calm  0.000033        0.000796    sale  0.000100        0.002399
 jack  0.000031        0.000744    lase  0.000100        0.002399
 marl  0.000029        0.000705    ales  0.000100        0.002399
 malt  0.000029        0.000691    alms  0.000086        0.002057
 cram  0.000028        0.000682    slam  0.000086        0.002057
 jabs  0.000028        0.000662    came  0.000083        0.001996
 lama  0.000051        0.000617    mace  0.000083        0.001996
 jade  0.000025        0.000598    acme  0.000083        0.001996
 mart  0.000025        0.000593    lace  0.000075        0.001789
 tram  0.000025        0.000593    case  0.000073        0.001743
 slam  0.000025        0.000588    aces  0.000073        0.001743
 alms  0.000025        0.000588    elms  0.000072        0.001738
 scam  0.000024        0.000569    lama  0.000135        0.001626
 cams  0.000024        0.000569    ease  0.000130        0.001561
```

```
  word      prob  unordered_prob      word      prob  unordered_prob
 major  0.000002        0.000280     meals  0.000009        0.001132
 jambs  0.000002        0.000258     salem  0.000009        0.001132
 rajah  0.000004        0.000249     males  0.000009        0.001132
 james  0.000002        0.000244     camel  0.000007        0.000844
 calms  0.000002        0.000189     maces  0.000007        0.000822
 clams  0.000002        0.000189     scale  0.000006        0.000737
 charm  0.000001        0.000179     laces  0.000006        0.000737
 march  0.000001        0.000179     lamas  0.000011        0.000670
 jacks  0.000001        0.000176     lease  0.000011        0.000660
 match  0.000001        0.000176     easel  0.000011        0.000660
 alarm  0.000003        0.000176     lemma  0.000011        0.000648
 malta  0.000003        0.000172     calms  0.000005        0.000632
 jacob  0.000001        0.000169     clams  0.000005        0.000632
 marls  0.000001        0.000167     realm  0.000005        0.000598
 malts  0.000001        0.000164     email  0.000005        0.000588
 scram  0.000001        0.000162     mares  0.000005        0.000582
 crams  0.000001        0.000162     smear  0.000005        0.000582
 jehad  0.000001        0.000157     reams  0.000005        0.000582
 camel  0.000001        0.000157     maser  0.000005        0.000582
 larch  0.000001        0.000152     shame  0.000005        0.000568
```

```
   word      prob   unordered_prob      word      prob   unordered_prob
 jetsam  1.137e-7         0.000082    camels  5.797e-7         0.000417
 majors  1.109e-7         0.000080    lemmas  8.904e-7         0.000321
 jackal  2.049e-7         0.000074    realms  4.104e-7         0.000296
 cajole  8.842e-8         0.000064    calmer  3.060e-7         0.000220
 abject  8.215e-8         0.000059    malice  3.010e-7         0.000217
 tarmac  1.580e-7         0.000057    scream  2.981e-7         0.000215
 jammed  1.518e-7         0.000055    creams  2.981e-7         0.000215
 calmer  7.431e-8         0.000054    schema  2.907e-7         0.000209
 charms  7.085e-8         0.000051    mealie  5.392e-7         0.000194
 alarms  1.388e-7         0.000050    clears  2.672e-7         0.000192
 jacket  6.817e-8         0.000049    gleams  2.653e-7         0.000191
 drachm  6.765e-8         0.000049    laches  2.605e-7         0.000188
 armlet  6.459e-8         0.000047    scales  5.061e-7         0.000182
 camels  6.202e-8         0.000045    sesame  1.011e-6         0.000182
 mortal  6.182e-8         0.000045    maples  2.459e-7         0.000177
 hamlet  5.967e-8         0.000043    sample  2.459e-7         0.000177
 calmed  5.922e-8         0.000043    alarms  4.857e-7         0.000175
 logjam  5.902e-8         0.000042    salaam  1.454e-6         0.000174
 scalar  1.142e-7         0.000041    resale  4.787e-7         0.000172
 rascal  1.142e-7         0.000041    sealer  4.787e-7         0.000172

```

```
    word      prob   unordered_prob         word      prob  unordered_prob
 jackals  9.726e-9         0.000025      seamail  5.258e-8        0.000133
 cajoled  4.007e-9         0.000020      malaise  5.258e-8        0.000133
 caramel  7.406e-9         0.000019      malices  2.480e-8        0.000125
 marshal  7.296e-9         0.000018      mealies  4.444e-8        0.000112
 calmest  3.461e-9         0.000017      measles  8.559e-8        0.000108
 thermal  3.393e-9         0.000017      caramel  3.986e-8        0.000100
 drachma  6.743e-9         0.000017      cameras  3.883e-8        0.000098
 rematch  3.284e-9         0.000017      realism  1.756e-8        0.000089
 matcher  3.284e-9         0.000017      smaller  3.472e-8        0.000088
 jackets  3.235e-9         0.000016      armless  3.382e-8        0.000085
 clamber  3.097e-9         0.000016      aimless  3.327e-8        0.000084
 armlets  3.065e-9         0.000015      cereals  2.941e-8        0.000074
 mortals  2.934e-9         0.000015      rescale  2.941e-8        0.000074
 hamlets  2.832e-9         0.000014      enamels  2.898e-8        0.000073
 sjambok  2.810e-9         0.000014      leaches  2.868e-8        0.000072
 marches  2.792e-9         0.000014      calmest  1.314e-8        0.000066
 camelot  2.751e-9         0.000014     caramels  3.285e-9        0.000066
 matches  2.740e-9         0.000014      miracle  1.309e-8        0.000066
 charmed  2.667e-9         0.000013      reclaim  1.309e-8        0.000066
 marched  2.667e-9         0.000013      females  2.601e-8        0.000066

```

```
     word       prob  unordered_prob        word      prob   unordered_prob
 caramels  3.515e-10        0.000007    caramels  3.285e-9         0.000066
 thermals  1.610e-10        0.000006    miracles  1.079e-9         0.000044
 drachmas  3.200e-10        0.000006    reclaims  1.079e-9         0.000044
 scramble  1.470e-10        0.000006    manacles  2.107e-9         0.000042
 clambers  1.470e-10        0.000006    massacre  3.200e-9         0.000032
 tracheal  2.782e-10        0.000006    harmless  1.435e-9         0.000029
 schemata  2.731e-10        0.000006    salesman  2.826e-9         0.000028
 majolica  2.575e-10        0.000005    cashmere  1.392e-9         0.000028
 chambers  1.163e-10        0.000005    mackerel  1.378e-9         0.000028
 cartload  2.297e-10        0.000005    calmness  1.333e-9         0.000027
 armholes  1.088e-10        0.000004    misplace  6.466e-0         0.000026
 majestic  1.077e-10        0.000004    maladies  1.264e-9         0.000025
 democrat  1.068e-10        0.000004    mileages  1.249e-9         0.000025
 tramcars  4.265e-10        0.000004    clambers  6.182e-0         0.000025
 chlorate  1.053e-10        0.000004    scramble  6.182e-0         0.000025
 mallards  4.176e-10        0.000004    rescales  2.424e-9         0.000024
 adjacent  2.007e-10        0.000004    careless  2.424e-9         0.000024
 matadors  1.997e-10        0.000004    nameless  2.388e-9         0.000024
 camshaft  1.966e-10        0.000004    lameness  2.388e-9         0.000024
 masthead  1.928e-10        0.000004    maleness  2.388e-9         0.000024
```

## BERMUDA 

Now circling back to the beginning, now we try to assign a likelihood to someone’s exes being able to form the acronym BERMUDA. The problem can be interepreted at least 4 ways, those being:

1. With **no choices**, **with** a specific order.
2. With **no choices**, **without** a specific order
3. With **choices**, and **with** a specific order
4. With **choices**, and **without** a specific order

Choice being the situation where you pick from a group of **N** people for your partner at every point, which is briefly suggested as another condition in the clip.

The calculations for each of these scenarios will use the unisex data from 1996-2021, as I'd like to avoid doing more calculations and filling this page with more tables.

### Scenario 1

This is a straightforward calculation, we multiply by the probabilities of each letter. Which gives us the answer: $$5.751 \times 10^{-11}$$. This is exceptionally unlikely, this scenario is unlikely to be fulfilled by any person ever born.

### Scenario 2

We have 7 letters, all unique. Therefore they can occur in $$7*6*5*…*1=7!=5040$$ different ways, so we simply multiply the previous probability used in scenario 1 to obtain our answer of $$2.898 \times 10^{-7}$$.

### Scenario 3

At each stage we have a desired letter to select e.g the first letter 'B'. If we let $$B$$ be the number of letter 'B's (or whatever letter is needed) obtained from this stage, we can model it as binomial like $$B \sim \text{Bin}(K, p_b)$$ where we have $$k$$ possible people to select for a partner, $$p_b$$ is the probability of the letter from the FLD, then the probability we have at least one B is $$P(B\ge 1)=1-P(B=0)=1-(1-p_b)^{k}$$. We rinse and repeat for all letters in BERMUDA, multiplying each one together and the results are in the table below.

| Choices | 2       | 4       | 6       | 8       | 10        | 15        | 20       | 50      | 100    | 1000   |
| ------- | --------| ------- | --------| ------- | --------- | --------- | -------- | ------- | ------ | ------ |
| Answer  | 6.02e-9 | 5.19e-7 | 6.04e-6 | 3.12e-5 | 1.04e-4 | 7.52e-4 | 0.0026 | 0.0393 | 0.118 | 0.740 |

### Scenario 4

In this scenario our agent (Lee Mack) is given $$k$$ choices at each stage for their next spouse, who all have an initial letter following the FLD. There are $$n=7$$ stages, one for each letter of BERMUDA. Because of the option to choose, an agent can play according to many different strategies. However we will focus on the optimal strategy where an agent will always pick the least likely letter available at the current stage (e.g prioritising an **U**rsula over an **A**my).

I solve this recursively using the function `recursive` below. (Note that it assumes no duplicate letters, so it needs modification for the general case.)

```python
def recursive(state, k, fld, cur=1):
    if all(x==1 for x in state):
        return cur
    condition_multiplier = 1
    total = 0
    
    for i in range(len(state)):
        if state[i] == 0:
            branch_prob = 1-pow(1-fld[i], k)
            full_thing = cur*branch_prob*condition_multiplier

            state[i]=1
            total += recursive(state, k, fld, full_thing)
            state[i]=0
            
            if k > 1:
                condition_multiplier *= (1-branch_prob)
    
    return total

# Calculating the values for Bermuda
values = list(range(1,11))+[15, 20, 30, 40, 50, 100, 500]
for k in values:
    answer = recursive([0 for _ in WORD], k, reversed(inprobs))
    print(f"{k: 5d} {answer:.4g}")
```

This recursive function traverses the tree of optimal choices in a depth first search, tracking the current probability at each point. The array $$\text{state}$$ stores which letters have been obtained at the current node, $$\text{state}[i]$$ is $$1$$ if we have gotten a letter[i] at the current node. $$\mathit{fld}$$ contains the FLD modified to contain only the letters we are interested in (u,b,d,r,e,m,a) and sorted ascendingly. In this situation $$\mathit{fld}=[0.00134, 0.0330,0.0346,0.0501,0.0747,0.0862,0.114]$$. $$cur$$ stores the probability of the current node.

Here's my best graphical explanation, using a simplified case of looking for a word 'ABC' with the probabilities of each letter being $$[0.1, 0.2, 0.3]$$

<img class="img1" src="/assets/images/acronymic/sketch.png"/>

For example at the B node at state $$[0, 1, 0]$$ what I unhelpfully named $$\mathit{full\_ thing}$$ is equal to the probability that no A's were obtained and at least 1 B was obtained. This is equal to $$P(A=0)\times P(B\ge 1) = (1-0.1^{k}) \times (1-(1-0.2)^{k})$$. We get the full answer by summing all leaf nodes, which all have states of $$[1,1,1]$$ .

The results I obtained are in the table below, also included is an upper bound which assumes a uniform probability for all letters. Unsuprisingly it is well within an order of magnitude, maybe next time I have a silly question and don't want to waste over a week I will just use upper bounds...


| Choices | Prob      | Upper bound |
| :------ | :-------- | :---------- |
| 1       | 2.898e-07 | 6.275e-7    |
| 2       | 1.525e-05 | 4.558e-5    |
| 3       | 0.000155  | 0.000451    |
| 4       | 0.0007026 |             |
| 5       | 0.002063  | 0.00578     |
| 6       | 0.004632  |             |
| 7       | 0.008683  |             |
| 8       | 0.01432   |             |
| 9       | 0.02149   |             |
| 10      | 0.03003   | 0.0802      |
| 15      | 0.08467   |             |
| 20      | 0.142     |             |
| 30      | 0.2367    |             |
| 40      | 0.3114    |             |
| 50      | 0.3752    | 0.841       |
| 100     | 0.6109    |             |
| 500     | 0.9911    | 0.979       |

To conclude the results, scenario 1 and 2, where there are no choices both seem unfeasibly likely, and seems possible that nobody on earth has fulfilled scenario 2 let alone an individual. And when we consider having choices, we get reasonable probabilties for k=50 and k=10 for scenario 3 and 4. So if you have a linguistic obsession with the word bermuda and are a highly desirable partner, this is a possible venture. 

<br/><br/>

Thank you to anyone who has dared read this far, I hope you enjoyed this. I welcome any corrections or comments.

<br/><br/>

## References

1. WILTY clip:  <https://www.youtube.com/watch?v=sypQXXN57T8>
2. Vocabulary: <http://www.mieliestronk.com/wordlist.html>
3. Census data: <https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/livebirths/datasets/babynamesinenglandandwalesfrom1996>
4. Reference first letter distribution: <https://themeaningofthename.com/traffic-and-name-statistics/names-first-letter-distribution/>
5. Multinomial theorem: <https://en.wikipedia.org/wiki/Multinomial_theorem>


## Addendum

Here are the changed of the FLDs for boy and girl names from the year 1996-2021, using the census data.

![boyschange](/assets/images/acronymic/boys_change.png)

![girlschange](/assets/images/acronymic/girls_change.png)
