---
layout: post
title:  Acronymic Groups
date:   2023-02-02 15:52:11 +0000
tags: stats language weird_questions
published: true
---
# Acronymic Groups
The other day I was was watching a round from the gameshow “Would I lie To You?” where Lee Mack says his he remembers his ex’s names by the acronym BERMUDA. A video clip of the round is available [here](https://www.youtube.com/watch?v=sypQXXN57T8). 

It got me thinking about the actual probability of being able to form an acronym from the names of your exes, or any group of people. This post is about calculating probabilties for the scenarios Lee Mack describes and the next post will be the covering general case.

I shall define an Acronymic Group as a group of people where using the first letter of everyones' name can be arranged into some word. 

## Name database

Before I begin the calculations I wanted a database of names and their frequencies so that I could produce a probability distribution of name first letters.  I'll call these first letter distributions (FLDs). Also I'll define an acronymic group as a collection of individuals whose names, when considering the initial letters, can be arranged to form a word.

I couldn't find many comprehensive lists of names which included frequencies, the best I found was from the UK census data [here](https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/livebirths/datasets/babynamesinenglandandwalesfrom1996).
The census data is split by gender (assigned from birth) and by year from 1996 to 2021, which as of writing will include anyone from the age of 2-28. This isn't perfect for  the right age range for Lee Mack's partners but it'll do. 

### Resulting first letter distribution.

Here are the produced FLDs, red for girls, green for boys and blue for the combined distribution.

![girls](/assets/images/acronymic/girls_fld.png)

![boys](/assets/images/acronymic/boys_fld.png)

![unisex](/assets/images/acronymic/unisex_fld.png)

## Every scenario 

With the data now acquired, we can now calculate probabilites for the chance of an acronymic group of BERMUDA. The problem can be interepreted at least 4 ways, those being:

1. With **no choices**, **with** a specific order.
2. With **no choices**, **without** a specific order
3. With **choices**, and **with** a specific order
4. With **choices**, and **without** a specific order

Order meaning that any permutation of the group is accepted.

Choice being the situation where you pick from a group of **N** people for your partner at every stage, which is mentioned as another condition in the clip.

With that understanding of each scenario we'll calculate the real numbers, for the word BERMUDA, using the unisex FLD data data from 1996-2021 as the assumed distribution of the first letter of each persons name.

### Scenario 1

This is a straightforward calculation, we multiply by the probabilities of each letter. Which gives us the answer: $$5.751 \times 10^{-11}$$. 
This scenario seems exceptionally unlikely and seems unlikely to be fulfilled by any person ever born. Thus anyone claiming so, is probably lying.

### Scenario 2

This scenario is the same as the previous, except we must account for every possible ordering. We can calculate this by multiplying the previous probability by the number of distinct permutations of the letters of the given word, considering there can be duplicate letters. The specific formula needed for this is the [multinomial coefficient](https://en.wikipedia.org/wiki/Multinomial_theorem) formula: 

$$\binom{n}{k_1,...,k_m} = \frac{n!}{k_1!.k_2!.....k_m!}$$

where $$n$$ is the total number of letters and $$k_1, ... k_{26}$$ is the frequency of each letter in the word.

In this situation the multinomial coefficient is simple, as all letters in the word occur once. Therefore they can occur in $$7*6*…*1=7!=5040$$ different ways, so we simply multiply the previous probability used in scenario 1 to obtain our answer of $$2.898 \times 10^{-7}$$. 
This scenario still quite unlikely but it is very possible this scenario was fulfilled by someone throughout history.

### Scenario 3

In this scenario we must consider each stage, where our agent chooses the next person added to the group from $$k$$ choices and there is a desired letter to select to satisfy the desired ordering. e.g the first letter 'B'.

If we let $$B$$ be the number of letter 'B's (or whatever letter is needed) obtained from this stage, it will follow the binomial distribution $$B \sim \text{Bin}(K, p_b)$$ where k is available choices, $$p_b$$ is the probability of the letter from the FLD. 

At any stage we just need one person with a letter B, and the probability of that is $$P(B\ge 1)=1-P(B=0)=1-(1-p_b)^{k}$$. We calculate the total probabiltiy by repeating for all letters in BERMUDA, multiplying each one together and the results for several values of K are in the table below.

| Choices | 2       | 4       | 6       | 8       | 10        | 15        | 20       | 50      | 100    | 1000   |
| ------- | --------| ------- | --------| ------- | --------- | --------- | -------- | ------- | ------ | ------ |
| Answer  | 6.02e-9 | 5.19e-7 | 6.04e-6 | 3.12e-5 | 1.04e-4 | 7.52e-4 | 0.0026 | 0.0393 | 0.118 | 0.740 |

Some of the probabilities here are much more plausbile, as k increases.

### Scenario 4

This is the same as situation 3 exception at each stage, we have a choice of letters to choose as any ordering of the group sufficies. This means an agent can play according to many different strategies. However we will focus on the optimal strategy where an agent will always pick the least likely letter available at the current stage (e.g prioritising an **U**rsula over an **A**my).

I solve this recursively using the function `solution` below. (Note that it assumes no duplicate letters, so it needs modification for the general case.)

```python
def solution(state, k, fld, cur=1):
  """
  condition_multiplier: probability that current branch is best one meaning no wanted letters produced from above branches.
  branch_prob: Probability of one appearance of desired letter i.
  cur: Probability of being at current node in this tree search.
  """
    if all(x==1 for x in state):
        return cur
    condition_multiplier = 1
    total = 0
    
    for i in range(len(state)):
        if state[i] == 0:
            branch_prob = 1-pow(1-fld[i], k)
            next_cur = cur*branch_prob*condition_multiplier

            state[i]=1
            total += recursive(state, k, fld, next_cur)
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

This solution function traverses the tree of optimal choices in a depth first search, tracking the current probability at each point. The array $$\textbf{state}$$ stores which letters have been obtained at the current node, $$\textbf{state}[i]$$ is $$1$$ if we have gotten a letter[i] at the current node. $$\textbf{fld}$$ contains the FLD modified to contain only the letters we are interested in (u,b,d,r,e,m,a) and sorted ascendingly. In this situation $$\textbf{fld}=[0.00134, 0.0330,0.0346,0.0501,0.0747,0.0862,0.114]$$. 
And $$\textbf{cur}$$ stores the probability of the current node.

Here's my best graphical explanation, using a simplified case of looking for a word 'ABC' with the probabilities of each letter being $$[0.1, 0.2, 0.3]$$

<img class="img1" src="/assets/images/acronymic/sketch.png"/>

For example at the B node at state $$[0, 1, 0]$$ what I unhelpfully named $$\mathit{full\_ thing}$$ is equal to the probability that no A's were obtained and at least 1 B was obtained. This is equal to $$P(A=0)\times P(B\ge 1) = (1-0.1^{k}) \times (1-(1-0.2)^{k})$$. We get the full answer by summing all leaf nodes, which all have states of $$[1,1,1]$$ .

The results I obtained are in the table below, I've also included an upper bound which assumes a uniform probability for all letters. Annoyingly it is well within an order of magnitude, maybe next time I have a silly question and don't want to waste over a week I will just use upper bounds. The upper bounds are calculated with this formula.

$$U = \prod_{i=0}^{6} \left(1 - \left(1 - \frac{7 - i}{26}\right)^k\right) $$


| Choices | Prob      | Upper bound |
| :------ | :-------- | :---------- |
| 1       | 2.898e-07 | 6.275e-7    |
| 2       | 1.525e-05 | 4.558e-5    |
| 3       | 0.000155  | 0.000451    |
| 4       | 0.0007026 | 0.002005    |
| 5       | 0.002063  | 0.00578     |
| 6       | 0.004632  | 0.0127      |
| 7       | 0.008683  | 0.0237      |
| 8       | 0.01432   | 0.0387      |
| 9       | 0.02149   | 0.0577      |
| 10      | 0.03003   | 0.0802      |
| 15      | 0.08467   | 0.223       |
| 20      | 0.142     | 0.374       |
| 30      | 0.2367    | 0.607       |
| 40      | 0.3114    | 0.752       |
| 50      | 0.3752    | 0.841       |
| 100     | 0.6109    | 0.980       |
| 500     | 0.9911    | 0.999       |

To conclude the results, scenario 1 seems impossible, scenario 2 seems near impossible, and scenario 3 seems plausible for (k>20) and scenario 4 for (k>10).
So if you have a linguistic obsession with the word bermuda and are a highly desirable partner, rest assured it should be suprisingly simple to systematically select and secure your specifically named significant others, unless susceptible to statistical significance.

In the next post I will show off more general solutions to each problem and find the most likely acronym.

## References

1. WILTY clip:  <https://www.youtube.com/watch?v=sypQXXN57T8>
2. Census data: <https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/livebirths/datasets/babynamesinenglandandwalesfrom1996>
3. Reference first letter distribution: <https://themeaningofthename.com/traffic-and-name-statistics/names-first-letter-distribution/>
4. Multinomial theorem: <https://en.wikipedia.org/wiki/Multinomial_theorem>


