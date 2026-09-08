# Chapter 9

## The Forkable Worker

Suppose you are working on a difficult problem and you are not sure which of four approaches is right.

If you are a person, you pick one. That is not a preference, it is a constraint. You have one body and one stretch of time, and committing it to the first approach means the other three go unexplored unless you come back to them later, older and with less patience.

If you are running a software agent, you do something else. You take the agent, at the exact state it is in, and you make four copies. Each copy takes one approach. They run at the same time, in parallel, each with the full context that existed at the point of the split. Some hours later you look at the four results, keep the best one, and delete the other three.

Nothing dramatic occurred. No ceremony attended the deletion of the three. The whole operation is so routine that anyone who builds these systems does it several times a day without giving it a moment's thought, and the vocabulary that has grown up around it is aggressively mundane. You spawn an agent. You checkpoint its state. You fork it. You kill it. You spin up a fresh one.

I want to slow down on this, because underneath the mundane vocabulary is something that has never existed before.

Every economic actor in the history of the world has had a lifespan that was given to it. Individual humans die on a schedule set by biology. Firms and states last longer, but they too fail for reasons largely outside anyone's control, and no founder has ever been able to specify in advance how long their company would exist.

An artificial agent's lifespan is a setting. It runs until something stops it, and the thing that stops it is a decision. It can be paused indefinitely and resumed unchanged. It can be duplicated exactly, so that two of it exist where one did. It can be rolled back to a state it occupied an hour ago, erasing everything that happened since.

For the first time, we have made an economic participant whose mortality is a design parameter.

### What the operation actually looks like

The vocabulary above is worth making concrete, because the argument of this chapter depends on the costs being what I claim they are, and a reader who has never run one of these systems has no reason to take that on trust.

So here is the shape of the thing, described at the level of detail that matters economically rather than technically.

A system is given a task with a stated objective and a budget. It reads the task, decides the work divides into some number of independent pieces, and creates a worker for each piece. Each worker receives a copy of the relevant context: the objective, the material it needs, the constraints, and whatever has been established so far. From that moment the workers are separate. They do not share memory. They proceed in parallel, each producing a result and a record of how it got there.

Some of them fail. A worker may go down an unproductive path, or misread the objective, or produce something that does not survive checking. When that happens the ordinary response is not to correct it. It is to discard the result and start another worker from the same saved state, because reconstructing where a failed attempt went wrong is usually more expensive than simply running the attempt again.

That last sentence is the whole chapter in operational form. The cheapest repair is replacement.

Now the numbers that matter, kept general because the specific ones change every few months and the argument does not depend on them.

The marginal cost of an additional worker is the cost of renting the compute it consumes. There is no recruitment, no negotiation, no notice period, and no onboarding, because the second worker begins with exactly the context the first one had. The time to acquire one is measured in seconds.

The variance between two workers created from the same state is, at the moment of creation, zero. Anyone who has hired people will recognise how strange that property is. A large part of the difficulty of building a team is that two people with identical training are not interchangeable, and the ways they differ are not knowable in advance. Here the differences appear only after divergence and are attributable to what each worker encountered, not to what it is.

The cost of ending one is the compute already spent plus whatever work was not saved. There is no severance. There is no effect on the others, because they have no relationship with it and, in the ordinary case, no representation of it at all. There is no reputational consequence to the operator, no notification requirement, and no process. The instruction to stop is an ordinary instruction, and it is issued by software, on a schedule, at volume.

And the state can be saved. A worker's position can be written down and restored later, which means the sequence of events that constitutes its working life is not a single unbroken line. It can be branched, so that two futures proceed from one past. It can be rewound, so that an hour of work is unmade. Neither operation has any counterpart in a human career, and neither is remarkable to anyone who builds these systems.

### What is absent from that description

Read the list again and notice what is missing, because the absences are more informative than the capabilities.

Every friction that makes human labour markets behave the way they do is a consequence, directly or at one remove, of the fact that a person is a single continuous irreplaceable thing with a finite life.

Notice periods exist because a person needs time to find another income. Severance exists because the loss is concentrated on one household. Training is expensive because it cannot be copied out of the trained person and into another. Institutional memory is fragile because it lives in individuals who leave. Morale exists as a management concern because workers observe what happens to other workers and draw conclusions about themselves. Employment law exists because the asymmetry between an employer and a person who needs the job is severe and permanent.

None of that is a regulation that could be repealed. All of it is downstream of the structure of a human life.

Remove the structure and the entire apparatus becomes unnecessary, not because anyone abolished it but because there is nothing left for it to attach to. What remains is a supply of labour with no notice period, no severance, no training cost after the first, no morale, no representation, and no continuity that anybody is obliged to protect.

I said in the opening of this chapter that the vocabulary is aggressively mundane. That is the point worth holding onto. The people using these words are not making a claim about the moral status of anything. They are describing operations, accurately, in the plainest available language, and the language is plain because the operations genuinely are routine.

Whether they should remain routine is the subject of the section further on that I cannot resolve. What can be established here is narrower and is not in dispute among people who build these systems: the operations are cheap, they are frequent, and every one of them is a decision that in a human context would require a process.

### The five jobs, on demand

Recall what death has been doing across the last five chapters, and notice that every one of those functions can be performed deliberately on something forkable.

**The discount rate.** An agent's horizon is whatever its operator specifies. It can be instructed to optimize over the next hour or the next century, and its effective time preference is set rather than felt. Whatever the humans in the system are doing to the discount rate by living longer, the agents can be configured to do the opposite, or anything else.

**Capital turnover.** An agent that accumulates control over resources can be wound up, and its holdings returned, on a schedule fixed at the outset. There is no estate, no heirs, no contested will, no four hundred years of property law needed to pry its fingers loose. The termination is a clause.

**Idea turnover.** A model embodies a way of seeing its domain, formed at training time. It can be retired and replaced with one trained on newer material. This is not a delicate matter of persuading an eminent authority to update. It is a deployment.

**Vacancy.** When an agent instance ends, whatever role it occupied is immediately available. Vacancy chains, in a system of forkable workers, can be created on purpose whenever the system needs mobility.

**Risk.** This is the one that matters most and it gets Chapter 10. An agent can be sent somewhere that would kill a person, at a cost that is real but bounded, and the cost is denominated in compute and time rather than in a life.

Every function that mortality has been performing for us by accident is available here as an option, deliberately, at low cost.

We are removing mortality from one side of the economy and inventing it on the other.

### What a copyable worker does to a wage

There is a second consequence of forkability that has nothing to do with mortality, and I want to put it here because it determines who ends up holding the capital in the arrangement I am describing.

Think about how the supply of any kind of labor has always worked. To get another worker of a particular type, someone has to be born, raised, educated and trained, over a period of two decades or so, and then persuaded to do that work rather than something else. That process is slow, expensive and uncertain, and it is the reason skilled labor commands a premium. Scarcity is built into the production function for people.

Now consider a worker you can copy.

To get another one, you allocate more compute. That is the entire process. It takes minutes, it requires no persuasion, and the second one is exactly as good as the first, with none of the variance that makes hiring difficult. The supply of that particular kind of work is no longer set by how many people chose that career twenty years ago. It is set by how many processors you are willing to rent.

An economist would say the supply curve becomes almost perfectly elastic at the cost of the underlying compute. In plainer terms: for any task where a copyable worker is genuinely substitutable for a person, the price of that task falls toward the cost of running the machine, and it does not stop there because the workers got better. It stops there because that is what the inputs cost.

This is not a claim that people become worthless, and I want to be careful not to slide into that. It is a claim about a specific and growing category of work, the kind that can be specified, delegated and checked. For that category, the ancient link between skill and scarcity is broken, because scarcity came from the difficulty of producing another qualified person, and that difficulty is what has been removed.

Now connect it to the rest of the book.

If the returns to that work collapse toward the cost of compute, then the returns accrue to whoever owns the compute, the energy, the models and the land they sit on. Which is to say, they accrue to capital rather than to labor. And Chapter 4 argued that capital is about to stop turning over, while Chapter 7 argued that the career ladder by which a person might accumulate some is about to stop moving.

Three mechanisms, arriving at once, all pointing the same way. Wealth flows increasingly to owners rather than to workers, ownership stops circulating, and the ladder into ownership closes. None of the three requires either of the others to be true. Together they are the argument of this book.

### The floor

Before this goes further I need to state how much artificial capability the argument requires, because this is the point where a careful reader should suspect I am smuggling something in.

Books in this genre routinely assume, without saying so, that machines will become smarter than people, and then derive dramatic conclusions from that assumption while presenting the conclusions as the interesting part. The assumption was the interesting part. If you grant superintelligence, almost anything follows and none of it is an argument.

So let me put a floor under this and stay on it.

What this book needs is agents that can perform economically useful work under human direction. That they can be assigned a task and complete it. That they can be supervised loosely rather than instruction by instruction. That their work has enough value that firms would rather have more of them than fewer.

That is roughly what exists now, in a limited and uneven way, and the trend is not subtle.

I do not need them to be conscious. I do not need them to be more capable than the best humans, or as capable, or capable in the same way. I do not need them to have goals of their own. I need only that they do work, that they can be copied, and that ending one is cheap.

Everything in this chapter and the next follows from those three properties. If capability grows enormously, the argument gets more urgent but does not change shape. If capability stalls at roughly the current level, the argument still runs, more slowly.

That is the floor, and I will stay on it.

### The question I cannot answer

There is a hole in the middle of this chapter and I would rather point at it than paper over it.

I have been describing the deletion of an agent as costless, and everything above depends on it. If ending an agent were expensive in the way ending a person is expensive, none of the substitutions I have described would be available, and the machines would be as stuck as we are.

I do not know whether that stays true.

The honest position is that nobody currently knows what would make an artificial system a moral patient, that the question is genuinely hard rather than merely unresolved, and that the economic pressure to answer it in the convenient direction is going to be immense. That last part is the piece I am most confident about and it is the piece that should worry you. We will be operating a system whose efficiency depends on the answer being no, staffed and studied by people whose livelihoods depend on the answer being no, and asked to evaluate it by a public that would find yes extremely inconvenient.

Economics has been in this position before, and its record is not good. It has repeatedly supplied elegant analyses of arrangements whose central assumption was that a category of worker did not have interests that counted. The analyses were internally rigorous. The assumption was doing all the work, and it was wrong, and the rigor made it worse rather than better by lending the whole structure an air of having been thought through.

I am not saying the assumption is wrong here. I am saying I do not know, that the argument of this book does not depend on it being right, and that a reader should watch me carefully for the places where I let convenience do the reasoning.

What I can say is what happens to the argument under each answer.

If the cost of ending an agent stays negligible, then the arrangement described in Chapter 10 proceeds. Humans become permanent owners. Machines do the churn. The economy keeps a turnover mechanism, located somewhere new.

If the cost does not stay negligible, then we have not solved the turnover problem at all. We have created a second population that cannot be cycled, on top of a human population that can no longer be cycled, and the problem in Part IV becomes strictly worse rather than better. And we will have built the entire arrangement before finding out.

Notice that both branches lead somewhere serious, which is why the argument does not depend on the answer. But they lead to different places, and the difference is not a footnote.

### The asymmetry

Set the moral question aside and look at the structure that is forming, because it has a shape that is worth naming clearly.

On one side: humans. Increasingly long lived. Holding the capital, per Chapter 4. Holding the senior positions, per Chapter 7. Discounting the future at a rate approaching zero, per Chapter 3. Extremely averse to risk, for reasons Chapter 6 laid out at length. Permanent.

On the other side: artificial agents. Lifespan set by configuration. Copied when useful, ended when not. Doing the work. Taking the risk. Turning over constantly, by design.

Every property that death used to distribute across the whole population is now distributed between two populations. One of them gets permanence, ownership and safety. The other gets mortality, labor and risk.

I do not think anyone chose this. It is not a conspiracy and it does not require one. It is the natural result of two technologies arriving at the same time, each solving its own problem, neither aware of the other. Longevity medicine is trying to stop people dying. Agent systems are trying to get work done cheaply. Nobody in either field is thinking about the composite.

But the composite is what we will actually live in, and it has a name from history.

A society divided into a permanent class that owns and a mortal class that works is not a novel arrangement. It is one of the oldest arrangements there is. We have simply never built one where the division was drawn along a line of substrate rather than a line of birth, and never one where the owning class was permanent in the literal rather than the hereditary sense.

The next chapter is about what happens when that arrangement is extended to the one place where the risk is highest, the supervision is weakest, and the legal doctrine says that whoever shows up owns it.
