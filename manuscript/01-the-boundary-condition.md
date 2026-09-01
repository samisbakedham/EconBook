# Chapter 1

## The Boundary Condition

There is a type of financial arrangement that works perfectly, forever, so long as nobody dies.

It is called a Ponzi scheme.

The mechanics are familiar. You take money from new investors and pay it to old ones, and you call the payment a return. Nothing is produced. Nothing is invested. The scheme survives exactly as long as new money keeps arriving, and it collapses the moment it stops, because there was never anything underneath it.

Every Ponzi scheme in history has collapsed. We tend to draw a moral lesson from this, which is that you cannot get something from nothing. That is not quite the lesson. The actual reason these schemes fail is more specific and more interesting. Each round needs more entrants than the last, and the supply of entrants is finite, and the participants keep leaving. People die, or retire, or need their money back. The scheme is a race between the growth of the obligation and the shrinkage of the pool, and the pool always wins.

Now take that same arrangement and write it into an economy that runs forever, populated by people who never exit.

The mathematics changes. Economists have known this since the 1950s, and it is not a fringe result. In certain models with infinite horizons, a bubble is not irrational and not doomed. It can be sustained indefinitely. Everybody in it behaves sensibly, everybody's expectations are met, and the thing never has to end. The formal name for these is rational bubbles, and the literature on them is respectable and old.

This is awkward, because economists would like their models to produce sensible prices, and a model that permits an asset to be worth infinity is not producing a sensible price. So the profession does something about it.

It assumes the problem away.

### The assumption nobody looks at

The technical fix has a name. It is called a transversality condition, and if you have taken a graduate economics course you met it in the second or third week, in the middle of a derivation, presented as a piece of housekeeping.

What it says, stripped of the notation, is that the value of what you are still holding at the end must go to zero. You are not allowed to carry value off into the infinite distance. Everything has to be settled up eventually.

There is a companion assumption called the no-Ponzi condition, which says roughly that you cannot roll your debts forward forever, paying each one with a new one. Together they close the model. The infinities vanish. The prices behave. The bubbles are ruled out by fiat, and the derivation proceeds.

I want to be careful here, because this is not a scandal and I am not alleging one. These conditions are defensible. They usually correspond to something real, and generations of careful people have thought hard about when to impose them.

But notice what the assumption is actually doing. It is a statement that the party ends. That obligations have to be settled, that value cannot be deferred forever, that nobody gets to hold a claim into eternity without ever making good on it.

It is death, smuggled back into a model that had been allowed to forget about it.

And here is the claim this book is built on. That misbehavior in the infinite horizon models is not a modeling artifact to be patched. It is a preview. Those equations are describing, quite accurately, what happens in an economy of agents who do not exit, and we have spent seventy years treating the description as a nuisance rather than as information.

### The two conditions, in plain language

That was the compressed version, and this is the chapter where a reader is most likely to be asked to take something on trust. So it is worth slowing down, because the two assumptions are not the same assumption, they do different jobs, and they are routinely taught together in a way that blurs the difference.

Start with the no-Ponzi condition, because it is the more intuitive of the two.

Imagine paying a credit card with a second credit card, then paying the second with a third. Nothing has been repaid. The obligation has been moved, and it has grown, because interest accrued on the way. You can run this for a while. What you cannot do is run it forever, and the reason is not moral. It is that the balance compounds, and at some point the amount you owe outruns anything you could plausibly produce, and a lender declines.

The no-Ponzi condition is that refusal, written into the model. It says a borrower's debt is not permitted to grow at or above the rate of interest indefinitely. It is a constraint imposed from outside, by the market, on what a borrower is allowed to attempt.

Now the transversality condition, which is a different kind of object and is frequently mistaken for the same one.

It is not a rule about what you are allowed to do. It is a statement about what a person who is optimizing would actually choose.

Suppose you are dividing your spending across a life in order to be as well off as possible overall. Suppose you die holding a large pile of unspent wealth. On the model's own terms, you made an error. You could have consumed some of it and been better off, and nothing was stopping you. An optimal plan does not leave value stranded at the end, because stranded value is wasted value.

So transversality is not a restriction that the economist imposes on the agent. It falls out of the optimization. It is the formal way of saying that at the end of the horizon, the value of what you are still holding must have gone to zero, because if it had not, you would have done something differently.

One is about what the world permits. The other is about what a sensible person wants. They arrive at similar looking algebra from opposite directions, and this is why they get bundled.

Now the part that matters for this book.

With a finite life, both conditions are nearly self enforcing, and the enforcer is the same in each case.

The lender is willing to extend credit because there is a point at which accounts are settled. The estate is valued, the assets are sold, the creditors are paid in whatever order the law specifies. The borrower cannot roll forever because the borrower stops. And the saver does not leave value stranded, because there is a specific moment after which they cannot use it, and they can see that moment coming, and they plan against it. The horizon is what makes the plan a plan.

Take the endpoint away and both mechanisms lose their footing at once.

An agent with no last period has no moment at which the accounts must be settled. There is no estate. There is no final valuation, no point at which a creditor can insist, and no reason a debt cannot be rolled into a further debt, because there is always another period in which to do it. The word "eventually" stops referring to anything. And on the other side, an agent who never stops has no moment after which unspent value is wasted, so leaving a claim outstanding forever is not obviously an error.

Which means that in a model of agents who do not exit, neither condition arises on its own. They have to be put in by hand.

And when they are not put in, the models do what Chapter 1 opened with. They admit paths in which value is carried forward indefinitely, in which an asset is worth something today purely because somebody will pay more for it tomorrow, forever, with everyone's expectations met at every step. The literature calls these rational bubbles. They are not errors in the arithmetic. They are solutions.

Two clarifications, because this is the point at which an economist reading closely will object, and both objections are fair.

The first is that these conditions are not arbitrary impositions and nobody in the field regards them as a trick. There is a serious technical literature on when a transversality condition can be derived rather than assumed, and in many settings it can be. The conditions usually correspond to something real about the environment being modeled.

The second is that this chapter is not claiming the models are wrong. They are not wrong. They are answering the question they were built to answer, for a population with the property their builders correctly assumed it had.

The claim is narrower. It is that the assumption which closes these models is doing more work than its presentation suggests, that the work it does is the work of an ending, and that we have been treating a description of what happens without endings as a technical inconvenience rather than as a result.

### The model where death does the work

If that seems like a stretch, consider the model that runs the other way.

In 1958 Paul Samuelson published a paper describing what became known as the overlapping generations model. It is one of the load bearing structures of modern macroeconomics, and it is taught everywhere.

The setup is simple. People live for two periods. Young, then old. The young work and earn. The old do not work and need to consume. There is no way to store goods from one period to the next, so the old cannot simply save real output and eat it later.

So how do the old eat?

The answer is that the young give them things, and the young do this because they expect the next generation of young to do the same for them. That expectation is what money is, in this model. Money has value not because it is backed by anything, but because everyone believes the sequence will continue. It is a chain of obligations running forward through time, sustained entirely by the arrival of new participants.

If that sounds like the thing I described at the top of this chapter, it is because it is. The model shows that an arrangement we recognize as fraudulent when a private citizen runs it can be the foundation of a functioning monetary system when a society runs it, and the difference is that a society keeps producing new members.

Take a moment with what this means. One of the standard workhorses of the field is a machine whose engine is generational replacement. Its output depends on people being born, aging, and dying, in sequence, forever. Remove the turnover and the model does not merely become less accurate. It stops running.

So we have two families of models. One breaks when people stop dying. The other is powered by people dying. And in neither case does anyone treat mortality as a variable worth studying. In the first it is imposed as a technical assumption. In the second it is built into the plumbing. In both it sits there, unexamined, holding the structure up.

### You cannot notice a variable that has never varied

Why has nobody looked at this?

Because until now there was nothing to look at. Mortality has been the most stable input in all of economics. Every other quantity the field studies has moved, often violently. Population, technology, energy prices, institutions, trade, the money supply, the size of the state. All of it swings around, and every swing generates a literature.

The human lifespan has not swung.

This deserves a moment of precision, because it is routinely misunderstood in both directions, and the misunderstanding matters for the rest of the book. Life expectancy at birth in wealthy countries has roughly doubled since 1850, from something in the thirties to something in the eighties. Some of that came from stopping children dying, and some of it did not: mortality fell at every age, and an adult today really does live substantially longer than an adult in 1850. Chapter 2 gives the numbers.

What has not moved is the ceiling. The longest verified human life still belongs to a Frenchwoman who died in 1997, and in the three decades since, with everything medicine has learned in the interval, nobody has come close.

So the number that determines the discount rate, the pace of inheritance, the turnover of ideas, the price of risk, and the rhythm of promotion has been, for the entire history of the discipline, a constant. Not a slow moving variable. A constant.

You cannot notice a variable that has never varied. You cannot run a regression on it. You cannot find its coefficient, because it has no variance to explain. It falls out of the analysis, not through carelessness, but because there is nothing there for the analysis to grip.

Which means that if the number ever does start to move, we will be looking at consequences with no theory of the cause. We will attribute them to policy, to culture, to central banks, to generational character, to anything at all except the thing that actually changed. In fact I think we are already doing this, and Chapter 3 is about the specific case where I believe it is happening in plain sight.

### Five jobs

The argument of this book is that death is not simply an unfortunate fact about the human condition that economics has failed to model. It is functional. It is doing work. Remove it and specific machinery stops.

I count five jobs. The middle section of the book takes one chapter each.

**It sets the price of time.** The rate at which we discount the future contains a term for the chance you will not be there to collect. Lower the chance and the rate falls automatically, without anyone deciding anything. As it approaches zero, the value of anything permanent stops being a finite number.

**It turns over capital.** Inheritance is the largest redistributive event in any market economy, and nobody legislated it. Death is the only force that reliably breaks up a concentrated fortune, and it does so on a schedule, without exception, regardless of how well the fortune is defended.

**It turns over ideas.** Fields change direction when the people who defined them stop occupying the chairs. This is not a slur on scientists. It is a measured effect, and Chapter 5 goes through the evidence.

**It prices risk.** How much danger you will accept depends on how much life you are wagering. That is the subject of Chapter 6, and it produces the strangest result in the book, which is that a civilization becomes unable to leave Earth through exactly the process that makes leaving possible.

**It creates openings.** Careers are queues. Queues advance because people leave them. Every promotion in every hierarchy is somebody else's exit, and when the exits stop, so does everything downstream of them.

None of these five has a backup. Not one. We have no institution standing by to redistribute capital if inheritance stops, no mechanism to rotate intellectual authority if the holders never vacate, no procedure for opening a position that nobody has left. These functions were never designed, so they were never given redundancy. They emerged from a biological fact that was so reliable that nobody thought to ask what would happen if it changed.

### What this book is not

Two disclaimers, both of which I will make good on in the next chapter.

This is not a book about whether we will live longer, and it does not depend on any particular biotechnology working. The argument runs on a much weaker premise than immortality, and I will state the premise precisely and defend it conservatively.

Nor is it a book about whether living longer is good. I think it is obviously good, in the way that not dying is obviously good, and I have no interest in the genre of essay that finds something spiritually improving about mortality. Death is not a teacher. It is a catastrophe that happens to be doing five jobs, and the jobs are the subject here.

What I am arguing is narrower and, I think, harder to dismiss. We are removing a beam. The beam was holding something up. Nobody has checked what.

The rest of this book is the inspection.
