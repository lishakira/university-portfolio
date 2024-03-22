datatype Bases = A | C | G | T

method Exchanger(s: seq<Bases>, x:nat, y:nat) returns (t: seq<Bases>)
requires |s| > 0
requires 0 <= x < |s| && 0 <= y < |s|
ensures |s| == |t|
ensures t[x] == s[y] && t[y] == s[x]
ensures forall i | 0 <= i < x <= y :: s[i] == t[i]
ensures forall i | x < i < y :: s[i] == t[i]
ensures forall i | x <= y < i < |s| :: s[i] == t[i]
ensures multiset(t) == multiset(s)
{
    t := s[x := s[y]];
    t := t[y := s[x]];
}

predicate bordered(s:seq<Bases>) 
requires |s| >= 0
{
    forall j,k :: 0 <= j < k < |s| ==> 
        if s[j] != A && s[k] == A then false
        else if s[j] != A && s[j] != C && s[k] == C then false
        else if s[j] == G && s[k] != G && s[k] != T then false
        else if s[j] == T && s[k] != T then false
        else true
}

method Sorter(bases: seq<Bases>) returns (sobases:seq<Bases>)
requires |bases| > 0
ensures |bases| == |sobases|
ensures multiset(sobases) == multiset(bases)
//ensures bordered(sobases)
{
    sobases := bases;

    var baseC:int := 0; // start of C bases
    var baseG:int := 0; // start of G bases
    var baseT:int := |sobases|; // start of T bases 
    var next:int := 0;
    while next != baseT
    invariant 0 <= baseC <= baseG <= next <= baseT <= |sobases|
    //invariant forall i :: 0 <= i < baseC ==> sobases[i] == A
    //invariant forall i :: baseC <= i < baseG ==> sobases[i] == C 
    //invariant forall i :: baseG <= i < next ==> sobases[i] == G 
    //invariant forall i :: baseT <= i < |sobases| ==> sobases[i] == T
    invariant |bases| == |sobases|
    invariant multiset(sobases) == multiset(bases)
    {
        match (sobases[next])
        {
            case A => sobases := Exchanger(sobases, next, baseG);
                      sobases := Exchanger(sobases, baseC, baseG);
                      next := next + 1;
                      baseC := baseC + 1;
                      baseG := baseG + 1;
            case C => sobases := Exchanger(sobases, next, baseG);
                      next := next + 1;
                      baseG := baseG + 1;
            case G => next := next + 1;
            case T => baseT := baseT - 1;
                      sobases := Exchanger(sobases, next, baseT);
        }
    }
}

method TestExchanger() {
    // Test Random 1
    var a:seq<Bases> := [A, C, A, T]; // the testcase sequence
    assert a == [A, C, A, T]; // verify the testcase sequence
    var b:seq<Bases> := Exchanger(a, 2, 3); // exchange bases at position 2 and 3
    assert b == [A, C, T, A]; // assert the new sequence
    assert multiset(b) == multiset(a); // test the new sequence contains the same bases

    // Test Random 2
    a := [A, C, A, T]; // the testcase sequence
    assert a == [A, C, A, T]; // verify the testcase sequence
    b := Exchanger(a, 0, 2); // exchange bases at position 0 and 2
    assert b == [A, C, A, T]; // assert the new sequence
    assert multiset(b) == multiset(a); // test the new sequence contains the same bases

    // Test Different Bases and Same Position
    a := [A, C, G, T]; // the testcase sequence
    assert a == [A, C, G, T]; // verify the testcase sequence
    b := Exchanger(a, 2, 2); // exchange bases at position 2 and 2
    assert b == [A, C, G, T]; // assert the new sequence
    assert multiset(b) == multiset(a); // test the new sequence contains the same bases

    // Test One Base and Same Position
    a := [A]; // the testcase sequence
    assert a == [A]; // verify the testcase sequence
    b := Exchanger(a, 0, 0); // exchange bases at position 0 and 0
    assert b == [A]; // assert the new sequence
    assert multiset(b) == multiset(a); // test the new sequence contains the same bases

    // Test Same Bases
    a := [A, A, A, A]; // the testcase sequence
    assert a == [A, A, A, A]; // verify the testcase sequence
    b := Exchanger(a, 1, 3); // exchange bases at position 1 and 3
    assert b == [A, A, A, A]; // assert the new sequence
    assert multiset(b) == multiset(a); // test the new sequence contains the same bases
}

method TestBordered() {
    // Bordered Sequence
    var a:seq<Bases> := [A, C, G, T]; // the testcase sequence
    assert bordered(a); // assert the bordered sequence

    a := [A, G, G, G, T]; // the testcase sequence
    assert bordered(a); // assert the bordered sequence

    a := [C]; // the testcase sequence
    assert bordered(a); // assert the bordered sequence

    a := [T, T, T]; // the testcase sequence
    assert bordered(a); // assert the bordered sequence

    a := []; // the testcase sequence
    assert bordered(a); // assert the bordered sequence

    // Non-bordered Sequence
    a := [G, A, T]; // the testcase sequence
    assert a[0] == G && a[1] == A && a[2] == T;
    assert !bordered(a); // assert the non-bordered sequence

    a := [T, C, G, A]; // the testcase sequence
    assert a[0] == T && a[1] == C && a[2] == G && a[3] == A;
    assert !bordered(a); // assert the non-bordered sequence

    a := [C, A, G]; // the testcase sequence
    assert a[0] == C && a[1] == A && a[2] == G;
    assert !bordered(a); // assert the non-bordered sequence

    a := [A, C, G, T, A, C]; // the testcase sequence
    assert a[0] == A && a[1] == C && a[2] == G && a[3] == T && a[4] == A && a[5] == C;
    assert !bordered(a); // assert the non-bordered sequence
}

method TestSorter() {
    // Test Random 1
    var a:seq<Bases> := [G,A,T]; // the testcase
    assert a == [G,A,T]; // assert the values
    var b:seq<Bases> := Sorter(a); // sort the bases in the sequence
    //assert bordered(b); // test the new sequence is ordered
    assert multiset(b) == multiset(a); // test the new sequence contains the same bases

    // Test Random 2
    a := [C, A, G, T, T, A, C, A, G]; // the testcase
    assert a == [C, A, G, T, T, A, C, A, G]; // assert the values
    b := Sorter(a); // sort the bases in the sequence
    //assert bordered(b); // test the new sequence is ordered
    assert multiset(b) == multiset(a); // test the new sequence contains the same bases

    // Test One Base 1
    a := [G]; // the testcase
    assert a == [G]; // assert the values
    b := Sorter(a); // sort the bases in the sequence
    //assert bordered(b); // test the new sequence is ordered
    assert multiset(b) == multiset(a); // test the new sequence contains the same bases

    // Test One Base 2
    a := [A, A, A]; // the testcase
    assert a == [A, A, A]; // assert the values
    b := Sorter(a); // sort the bases in the sequence
    //assert bordered(b); // test the new sequence is ordered
    assert multiset(b) == multiset(a); // test the new sequence contains the same bases

    // Test Ordered Sequence
    a := [A, C, G, T]; // the testcase
    assert a == [A, C, G, T]; // assert the values
    b := Sorter(a); // sort the bases in the sequence
    //assert bordered(b); // test the new sequence is ordered
    assert multiset(b) == multiset(a); // test the new sequence contains the same bases
}