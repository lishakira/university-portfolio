lemma {:induction false} LemNPS(n: nat, k: nat)
{

}

// The square of a number is not equivalent to equation on the left-hand side (LHS).
method PropertyTester(n: nat, k: nat)
requires n%2==1
{
    //assert n*(n+2) != k*k;
}
