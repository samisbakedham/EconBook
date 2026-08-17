# Chapter 6

## Nobody Goes to Space

In July 1969, a speechwriter named William Safire drafted remarks for President Nixon that were never delivered. They began: "Fate has ordained that the men who went to the moon to explore in peace will stay on the moon to rest in peace." The plan was for Nixon to telephone the widows first. Then a clergyman would commend the men's souls to the deep, in the manner of a burial at sea. Then Mission Control would close the line, and two men would suffocate on the surface of another world while the planet listened.

NASA flew anyway.

This is the part of the Apollo story we have stopped finding remarkable, and it is the only part that matters for what follows. Neil Armstrong is said to have put his odds of coming home at about nine in ten, and his odds of landing at closer to a coin flip. Nobody on that program was confused about the arithmetic. They ran it, they wrote the eulogy, they filed it in a drawer, and they lit the rocket.

We tend to explain this with character. They were braver then; the culture was harder; test pilots were a particular kind of person. I want to propose a less flattering and more useful explanation. They were cheaper.

Not cheaper as people. Cheaper as assets. The economic value of a human life is not a constant of nature. It is a price, it moves, and over the next century every force we are excited about is going to move it in the same direction — up, steeply, and without limit. The frontier will not close because we lack the engines. It will close because we can no longer afford the funeral.

---

### What a life costs

Regulators have to put a number on a life. This offends people when they first hear it, and then they think about it for a minute and realize there is no alternative. If a highway guardrail costs forty million dollars and prevents a death every other year, someone has to decide. Refusing to name the number does not avoid the decision; it just makes the decision worse and less accountable.

So the number gets named. It is called the value of a statistical life, and in recent United States federal guidance it has run somewhere in the neighborhood of ten to thirteen million dollars. It is not the value of *you*. It is the aggregate of what a large number of people demand, in wages or in cash, to accept small increments of mortality risk — the rate at which ordinary humans actually trade safety for money, backed out of labor markets and revealed preference studies rather than from anyone's philosophy.

Two features of that number are worth a practitioner's attention, because they are usually treated as footnotes and they are in fact the whole story.

The first: it scales with wealth. Richer populations demand more compensation to accept the same hazard. This is not a moral claim about whose life counts; it is the mechanical consequence of declining marginal utility. When you have little, the marginal dollar buys a great deal, and you will accept real danger to get it. When you have a great deal, the marginal dollar buys almost nothing, and the same danger is no longer worth entertaining. The value of a statistical life is, in this sense, a measure of how much the world has left to offer you at the margin.

The second: it scales with time remaining. The convention here is to convert the lump sum into a value per statistical life-year — divide the total by the discounted count of years a person can expect to have left. Do this and you get something on the order of a few hundred thousand dollars per year, which is roughly the figure that lurks behind health technology assessments in most rich countries.

Run that conversion backward and the implication is immediate. If a life-year has a price, then a life's worth is the number of life-years multiplied by that price, discounted. Extend the life and you extend the sum. There is no term in the equation that saturates.

Hold that thought, because it is about to collide with something.

---

### The duration problem

Here is the same idea in the language of a bond desk, where I think it is clearest.

A human life, priced as an asset, is a stream of expected future consumption and experience. A seventy-year-old is a short-dated instrument: a few years of coupons, then maturity. A twenty-five-year-old today is something like a fifty-year bond. Both are finite, both are priced, and both have a duration — a sensitivity to the discount rate that is bounded by the fact that the cash flows eventually stop.

Now cure aging. Not death — aging. The person in front of you is no longer a fifty-year bond. They are a perpetuity.

Anyone who has priced a perpetual instrument knows what happens next, and knows it in their hands rather than as a theorem. Duration explodes. Convexity explodes. The asset becomes violently sensitive to exactly two inputs: the discount rate, which I take up in Chapter 3, and the hazard rate — the per-period probability that the stream simply stops.

For a fifty-year bond, a small change in default probability is a nuisance. For a perpetuity, it is the entire valuation. When the cash flows never end, the only thing that determines what the instrument is worth is the chance that something interrupts them. Every dollar of value lives in the tail.

This is the structural fact that character-based explanations of Apollo miss. Armstrong was not braver than a person who will live for a thousand years. He was shorter duration. He was wagering thirty or forty expected years on a coin flip. The thousand-year person is asked to wager a perpetuity on the same coin flip, and no amount of courage changes what that trade is worth.

---

### What actually kills you when nothing else does

It is worth being precise about how long "indefinite" actually is, because the answer is not infinity and the difference matters.

Human mortality in adulthood follows a curve first described by Benjamin Gompertz in 1825: after roughly age thirty, your annual chance of dying doubles about every eight years. This is the aging term. It is why a healthy sixty-year-old and a healthy thirty-year-old are, statistically, entirely different animals. Almost everything we call medicine is an argument with this curve.

Underneath it sits a second, flatter component that has nothing to do with aging: the extrinsic hazard. Cars. Falls. Fires. Drownings. Violence. Aircraft. The background rate at which the physical world removes people who were in perfect health that morning. In a wealthy country, for a young adult, this runs somewhere on the order of one in two thousand per year.

Now suppose we win — suppose the Gompertz term goes to zero and only the background hazard remains. Your life expectancy is then simply the reciprocal of that hazard rate. One in two thousand per year gives you an expectancy on the order of two thousand years. Push the extrinsic rate down with better cars and better medicine and the number climbs further; let it drift up and the number collapses. The estimate is enormously sensitive to an input most people never think about, which is itself the point.

Notice what has happened to the composition of risk. Today, roughly speaking, aging kills you and accidents are a rounding error. In the world we are discussing, aging kills nobody and accidents kill *everyone*. One hundred percent of mortality becomes accidental. Every death is now, in the strict sense, a preventable one — the outcome of a risk somebody chose to run, or chose to let someone else run.

There is no historical precedent for a society in which that is true, and I do not think we have begun to reckon with what it does to the politics of risk. Every workplace fatality, every traffic death, every launch failure becomes not a tragedy but an indictment. Someone signed off on that hazard rate.

---

### The absorbing barrier

Now the formal core, which I will state plainly because it is the load-bearing beam of the chapter.

Death is an absorbing state. You can be wealthy and become poor and become wealthy again; the path is reversible and the process continues. Death has no exit. Once the process enters it, no future period exists in which to recover.

Anyone who has thought about position sizing knows the consequence. It is the whole content of the Kelly criterion and of what Ole Peters has more recently formalized as ergodicity economics: the average outcome across many parallel gamblers is not the outcome available to one gambler playing in sequence. If a bet has attractive expected value but carries a small chance of ruin, a thousand people taking it once may do beautifully while one person taking it a thousand times goes broke with probability approaching one. The ensemble average lies to you. What you actually get is the time average, and the time average is destroyed by absorbing states.

Apply this to a life with no natural end. Take any fixed per-period probability of accidental death, however small. Over enough periods, the probability of survival is that per-period survival rate raised to the number of periods, and any number below one raised to a large enough power goes to zero. Over an unbounded horizon, ruin is not a risk. It is a certainty with a waiting time.

Which yields a conclusion I find genuinely startling, and which I have not seen stated anywhere in the longevity literature:

**Curing aging does not produce immortality. It converts the problem of immortality from a biological one into a risk-management one — and the risk-management version is harder.**

Biology is a finite adversary. There is a specific list of mechanisms, and in principle each can be addressed. The extrinsic hazard is not a finite adversary. It is the open-ended set of ways a physical universe can intersect a fragile body, and driving it to zero is not a research program, it is an eschatology. The best you can do is push it down, decade after decade, forever — and the marginal cost of each further reduction rises without bound, because you are working through an ever-longer tail of ever-stranger failure modes.

So the rational policy for a non-aging person is not to live well. It is to minimize the hazard rate, continuously, at almost any price. Not because such a person is a coward, but because the arithmetic gives no other answer. Every unit of risk accepted is not a wager against forty remaining years. It is a wager against all of them.

---

### The price of the frontier

Assemble the pieces.

Space is, and will remain for a long time, an environment with an irreducibly elevated hazard rate. Not because engineering cannot improve — it improves enormously — but because the floor is set by physics rather than by diligence. Chemical rockets are controlled explosions. Vacuum is unforgiving of single-point failures. Radiation is cumulative and shielding is heavy and mass is the binding constraint on everything. Transit times to anywhere interesting are long, and abort options during them range from poor to nonexistent. You can drive the risk of a launch down by orders of magnitude and still be somewhere far above the ambient hazard of a life spent in a temperate city with good hospitals.

The Space Shuttle lost two vehicles in a hundred and thirty-five flights. Call it one and a half percent per flight, from the most sophisticated program the wealthiest nation on earth could mount, over thirty years, after learning from the first loss. Suppose the next century does spectacularly well and takes that to one in ten thousand — better, per journey, than a great many things we do without comment.

For a person with forty expected years remaining, one in ten thousand is a trivial price for the chance to be among the first humans somewhere. It is not obviously worse than a career of small-aircraft flying, and people accept that without a second thought.

For a person with two thousand expected years, the same one-in-ten-thousand is a wager of a fifth of a year of expected life — which sounds modest until you price it. At a few hundred thousand dollars per statistical life-year, that is a risk premium in the tens of thousands of dollars per launch, per person, before anything else. But the life-year price is not fixed either: it rose with wealth, and this is by construction the wealthiest society that has ever existed. Push both terms — more years, each year worth more — and the premium does not rise linearly. It compounds.

And that is only the direct cost. The rest arrives through the institutions, and this is where I think the closure actually happens, because it happens without anyone deciding it.

Insurers price the tail, and the tail is now enormous. Liability follows the insurance. Regulators, who are already loss-averse and now face a public for whom every death is an indictment, follow the liability. Capital allocators — and here I am describing my own trade — face the fact that the people with the balance sheets to fund frontier ventures are precisely the people with the longest personal duration and the most to lose, and the additional fact that a hundred-year project undertaken by an immortal principal is one they will personally be present to be blamed for. Nobody bans space. The insurance simply becomes unwritable, and the thing dies of underwriting.

So here is the paradox in its final form, and it is worth stating as flatly as possible.

**A civilization becomes capable of settling the frontier by exactly the same process that makes it unwilling to.** The wealth, the medicine, and the safety that make interstellar ambition thinkable are the wealth, the medicine, and the safety that make its cost intolerable. Capability and willingness are not independent variables that happen to be in tension. They are the same variable, and they run in opposite directions.

Every civilization rich enough to reach the stars is too rich to go.

---

### Four objections

I want to take the strongest versions of the counterarguments, because a paradox that survives only the weak ones is a slogan.

**It only takes a few volunteers.** True, and irrelevant. Frontier settlement is not a shortage of willing bodies; there has never been such a shortage. It is a shortage of capital, insurance, launch licenses, supply chains, and legal cover, all of which are controlled by parties with no appetite for the tail. History's frontiers were opened by financing, not by volunteers. Magellan's expedition left with five ships and something like two hundred and seventy men in 1519, and one ship and eighteen men came home three years later — and the reason it sailed at all was that the Spanish crown could absorb a loss it fully expected. The volunteers were never the constraint. The underwriter was.

**Backups and uploads dissolve the problem.** This is the serious objection, and I think it is correct — for whatever can actually be copied. If your existence is state that can be replicated, death stops being an absorbing barrier and becomes an expensive rollback, and the entire argument above collapses. Note precisely what that concedes: the frontier reopens *only* for entities that can be copied. Which is not us, and it takes me directly to the next chapter.

**Machines go instead.** Yes. That is my point, not a refutation of it. Robotic and artificial explorers are the natural answer to an intolerable hazard rate, and they will do the work. But we should be clear-eyed about the consequence: the entities that take the risk are the entities that establish presence, and presence, historically, is what becomes title. The frontier will be settled by whatever can afford to die there, and it will be owned by whatever settles it. Whether those two things remain the same thing is the political question of the next two centuries.

**The old and the sick will still go.** They will — and this is the objection that turns the argument rather than defeating it.

---

### The mortal inherit the stars

If the willingness to accept risk is set by how much life you are wagering, then the frontier does not close for everyone. It closes for the long-lived and opens for everyone else.

Whoever has less to lose goes. That set includes the poor, in any world where longevity treatment is expensive or rationed. It includes the artificial, whose lifespans are a design decision. And it includes, most interestingly, those who *decline* — people who look at two thousand years of careful risk minimization, at a life organized entirely around not dying, and decide they would rather have a short one that goes somewhere.

That is not a fringe position. It may turn out to be the most consequential choice available to a human being in the next century, because it is the choice that determines who holds the frontier. And whoever holds the frontier eventually holds the rest.

We have carried an assumption for a long time — through every space program, every science fiction novel, every argument for why the species should not keep all its eggs in one atmosphere. The assumption is that the future belongs to the people who last. I think it may be exactly backward. Longevity buys you Earth: an old, safe, wealthy, immaculately insured planet on which nothing is permitted to go wrong.

Everything else goes to the ones who were willing to end.

---

### Notes

*Draft citations — figures marked (v) are stated from memory and need verification against primary sources before publication.*

1. Safire's memorandum, "In Event of Moon Disaster," dated July 18, 1969, is in the Nixon Presidential Library holdings. Quotation to be checked against the archival scan. (v)
2. Armstrong's odds: widely reported in Apollo oral histories; needs a sourced attribution rather than the folkloric version. (v)
3. US Department of Transportation and EPA value-of-statistical-life guidance; figures vary by agency and vintage. Viscusi and Aldy's 2003 meta-analysis is the standard reference for the wage-risk literature. (v)
4. Value per statistical life-year conventions and their use in health technology assessment. (v)
5. Gompertz, "On the Nature of the Function Expressive of the Law of Human Mortality," *Philosophical Transactions*, 1825. The eight-year doubling is an approximation that varies by population. (v)
6. Extrinsic-hazard life expectancy: the reciprocal-of-hazard calculation is standard, but the input rate should be built explicitly from external-cause mortality tables rather than asserted, since the whole estimate turns on it. (v)
7. Peters, "The ergodicity problem in economics," *Nature Physics*, 2019. Kelly, "A New Interpretation of Information Rate," 1956.
8. Shuttle flight and loss counts are firm; the retrospective probabilistic risk assessments of early-flight risk are worth quoting directly, as they are more alarming than the realized record. (v)
9. Magellan expedition departure and return figures vary across sources; use Pigafetta plus a modern scholarly account. (v)
