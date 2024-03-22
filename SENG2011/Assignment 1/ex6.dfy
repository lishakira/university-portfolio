// ex6.dfy
// Shakira Li (z5339356)

predicate clumped1(a: array<int>) 
reads a
{
    // placeholder: not right -- from lecture slides
    forall j,k:: 0<=j<k<a.Length ==> a[j]<=a[k] 
}

predicate clumped2(a: array<int>) 
reads a
{
    // placeholder: not right -- from lecture slides
    forall j,k:: 0<=j<k<a.Length ==> a[j]<=a[k] 
}

method Clumped12Tester() {
    var a:array<int> := new int[0];
    assert a.Length == 0;
    //assert clumped1(a);
    //assert clumped2(a);

    a := new int[5];
    a[0], a[1], a[2], a[3], a[4] := 42, 42, 42, 42, 42;
    assert a[0]==42 && a[1]==42 &&  a[2]==42 &&  a[3]==42 &&  a[4]==42;
    //assert clumped1(a);
    //assert clumped2(a);

    a := new int[5];
    a[0], a[1], a[2], a[3], a[4] := 42, 42, 42, 1, 1;
    assert a[0]==42 && a[1]==42 &&  a[2]==42 &&  a[3]==1 &&  a[4]==1;
    //assert clumped1(a);
    //assert clumped2(a);

    a := new int[1];
    a[0] := 42;
    assert a[0]==42;
    //assert clumped1(a);
    //assert clumped2(a);

    a := new int[5];
    a[0], a[1], a[2], a[3], a[4] := 1, 2, -1, 8, 0;
    assert a[0]==1 && a[1]==2 &&  a[2]==-1 &&  a[3]==8 &&  a[4]==0;
    //assert clumped1(a);
    //assert clumped2(a);

    a := new int[3];
    a[0], a[1], a[2] := 42, 1, 42;
    assert a[0]==42 && a[1]==1 &&  a[2]==42;
    //assert !clumped1(a);
    //assert !clumped2(a);

    a := new int[5];
    a[0], a[1], a[2], a[3], a[4] := 0, -1, -1, -1, 0;
    assert a[0]==0 && a[1]==-1 &&  a[2]==-1 &&  a[3]==-1 &&  a[4]==0;
    //assert !clumped1(a);
    //assert !clumped2(a);
}

method ClumpedEquality() {
    var a:array<int> := new int[0];
    assert a.Length == 0;
    //assert clumped1(a) == clumped2(a);

    a := new int[5];
    a[0], a[1], a[2], a[3], a[4] := 42, 42, 42, 42, 42;
    assert a[0]==42 && a[1]==42 &&  a[2]==42 &&  a[3]==42 &&  a[4]==42;
    //assert clumped1(a) == clumped2(a);

    a := new int[5];
    a[0], a[1], a[2], a[3], a[4] := 42, 42, 42, 1, 1;
    assert a[0]==42 && a[1]==42 &&  a[2]==42 &&  a[3]==1 &&  a[4]==1;
    //assert clumped1(a) == clumped2(a);

    a := new int[1];
    a[0] := 42;
    assert a[0]==42;
    //assert clumped1(a) == clumped2(a);

    a := new int[5];
    a[0], a[1], a[2], a[3], a[4] := 1, 2, -1, 8, 0;
    assert a[0]==1 && a[1]==2 &&  a[2]==-1 &&  a[3]==8 &&  a[4]==0;
    //assert clumped1(a) == clumped2(a);

    a := new int[3];
    a[0], a[1], a[2] := 42, 1, 42;
    assert a[0]==42 && a[1]==1 &&  a[2]==42;
    //assert !clumped1(a) == !clumped2(a);

    a := new int[5];
    a[0], a[1], a[2], a[3], a[4] := 0, -1, -1, -1, 0;
    assert a[0]==0 && a[1]==-1 &&  a[2]==-1 &&  a[3]==-1 &&  a[4]==0;
    //assert !clumped1(a) == !clumped2(a);
}