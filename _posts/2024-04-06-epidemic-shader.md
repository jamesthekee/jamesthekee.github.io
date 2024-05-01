---
layout: post
title: "Simulating vaccines with shaders"
date: 2024-04-09 23:59:00 +0000
tags: shader simulation
published: true
---

# Epidemics and vaccines with shaders

I've been spending more and more time into shaders in these last months, and recently decided to recreate part of my Bachelors dissertation using it, for a real-time visual simulation. One part of my dissertation was recreating the results of this [paper](https://www.nature.com/articles/srep05666), which we'll loosely recreate in this post.

## SIR

The very foundations of the model, is an SIR simulation. What this means is that any agent in the simulation can be either of 3 states: susceptible (S), infected (I) and recovered (R), hence the name SIR. Susceptible agents can be infected, infected agents can infect susceptible neighbours and recovered agents are immune to the infection. The agents are geographically situated on a 2d grid and we consider the eight cells around a cell neighbours, and can spread the disease between them.  

We begin the simulation by infecting some proportion of the cells, then at each following time step:
1. If a cell is infected it recovers with probability $$p_r$$
2. If a cell is susceptible recover with probability $$1-(1-p_i)^{n}$$ where $$n$$ is the number of infected neighbours.


A shader implementing is this is shown below. (You may need to press the \|< button to start it.)

<iframe width="640" height="360" frameborder="0" src="https://www.shadertoy.com/embed/4cy3Rm?gui=true&t=10&paused=true&muted=false" allowfullscreen></iframe>

This shader has some extra flair, where I've coloured recovered cells based on the sine of when they were infected.

## Evolution

The next bit's a bit complicated, perhaps overly. I'm not particularly sure why I'm still going into this.  

Next we need to introduce seasons. The epidemics begins at the start of each season, and then ends at end of the season. When a season concludes each agent considers the payoff of its strategy (whether it decided to vaccinate or not) and looks to a random neighbour to see if it did better with an alternative strategy. If it did there is a probability that it will use the opposite strategy for the next season.

Payoff is determined by the outcome of the agent, if its infected/recovered it will receive a negative payoff $$C_i$$, if it's vaccinated it will received a negative payoff $$C_v$$ and if it's susceptible (healthy) it will receive a payoff of $$0$$. We can assume that $$C_V<C_i$$ because otherwise that's a stupid reality. We can reduce variables, without loss of generality, by saying $$C=C_v/c_i$$ with $$C$$ being the new relative cost of a vaccine.

At the end of each season, each agent will look at a random neighbour and if they have a different strategy will compare their payoffs. An agent A and neighbour B, has a probability $$p_{a\rightarrow b}=\frac{1}{1+exp(-\beta(p_b-p_a))}$$ of swapping from strategy $$a$$ to strategy $$b$$.

With it fully defined, we can now run the simulation and observe the system. I recommend not just watching it with full rapture (like I do) but to poke around with the parameters defined with `#define` and see if you can find anything suprising. 

<iframe width="640" height="360" frameborder="0" src="https://www.shadertoy.com/embed/XfKGD1?gui=true&t=10&paused=true&muted=false" allowfullscreen></iframe>

What you may observe is that:
1. Over several seasons the number of vaccinators converges rather quickly to an intermediate value. But never reaches full vaccination
2. A noisy labyrinth sort of structure tends to emerge.

Here's a little variation below with two values for $$\beta$$, with a $$\beta=1$$ on the left and $$\beta=64$$ on the right. The $$\beta$$ parameters represents an agent's sensitivity to the difference in payoff between an agent and its neighbour. A lower beta means the agents are more likely to imitate neighbours and a higher beta means the agents are much more likely to strictly pick the strategy of highest payoff for themselves.

<iframe width="640" height="360" frameborder="0" src="https://www.shadertoy.com/embed/lfK3Wh?gui=true&t=10&paused=true&muted=false" allowfullscreen></iframe>

Over time each side diverges in terms of structure, with the left side having more noise and more thin maze structure whilst the right side has more smooth structure and larger corridors.

The most interesting thing is that a vertical wall emerges down the middle.

## Conclusion

There's not much to this post, but I think there may be some other people who think its just neat and I hope they do.

  
  
### Deviations from original paper.

1. Original paper was conducted on Barabasi Scale-free networks and Homogenous Small World Networks.
2. Paper had a constant amount of initial infections in each season
3. Seasons terminated when infection ended.
4. The paper also looked at vaccine subsidies and two different policies for encourage them (I have looked into it and there's nothing visually interesting about them.)



