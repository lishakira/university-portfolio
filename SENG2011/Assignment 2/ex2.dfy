function bullspec(s:seq<nat>, u:seq<nat>): nat
requires |s| >= 0 && |u| >= 0
requires |s| == |u|
ensures 0 <= bullspec(s, u) <= |s|
ensures 0 <= bullspec(s, u) <= |u|
decreases |s|
decreases |u|
{
    if |s| == 0 || |u| == 0 then 0
    else if s[0] == u[0] then 1 + bullspec(s[1..], u[1..])
    else bullspec(s[1..], u[1..])
}

function cowspecHelper(s:nat, u:seq<nat>, index:int, length:int): nat
requires |u| >= 0
ensures 0 <= cowspecHelper(s, u, index, length) <= |u|
decreases |u|
{
    if |u| == 0 then 0
    else if length - |u| != index && s == u[0] then 1
    else cowspecHelper(s, u[1..], index, length)
}

function cowspec(s:seq<nat>, u:seq<nat>): nat
requires |s| >= 0 && |u| >= 0
{
    if |s| == 0 then 0
    else cowspecHelper(s[0], u, |u|-|s|, |u|) + cowspec(s[1..], u)
}

method BullsCows (s:seq<nat>, u:seq<nat>) returns (b:nat, c:nat)
requires forall i :: 0 <= i < |s| ==> forall j :: 0 <= j < |s| && i != j ==> s[i] != s[j]
requires forall i :: 0 <= i < |u| ==> forall j :: 0 <= j < |u| && i != j ==> u[i] != u[j]
requires |s| > 0 && |u| > 0
requires |s| == |u|
ensures b == bullspec(s, u)
//ensures c == cowspec(s, u)
{
    b := 0;
    c := 0;
    var i:int := |s|;
    while i > 0
    invariant 0 <= i <= |s|
    invariant b == bullspec(s[i..], u[i..])
    //invariant c == cowspecHelper(s[i], u, i, |u|)
    {
        i := i - 1;

        if s[i] == u[i]
        {
            b := b + 1;
        }

        if s[i] != u[i] && u[i] in s
        {
            c := c + 1;
        }
    }
}

method Tester() {
    // Test Random Numbers
    var sys:seq<nat> := [4,2,9,3,1]; // system selection
    var usr:seq<nat> := [1,2,3,4,5]; // user guess
    assert sys == [4,2,9,3,1] && usr == [1,2,3,4,5]; // verify the sequences

    assert bullspec(sys, usr) == 1; // verify the bulls
    assert cowspec(sys, usr) == 3; // verify the cows
    
    var b:nat, c:nat := BullsCows(sys, usr); // calculate the bulls and cows
    //assert b == 1 && c == 3; // verify the calculation of bulls and cows

    // Test One Number
    sys := [1]; // system selection
    usr := [1]; // user guess
    assert sys == [1] && usr == [1]; // verify the sequences

    assert bullspec(sys, usr) == 1; // verify the bulls
    assert cowspec(sys, usr) == 0; // verify the cows

    b, c := BullsCows(sys, usr); // calculate the bulls and cows
    //assert b == 1 && c == 0; // verify the calculation of bulls and cows

    // Test Same Numbers and Positions
    sys := [1,2,3,4]; // system selection
    usr := [1,2,3,4]; // user guess
    assert sys == [1,2,3,4] && usr == [1,2,3,4]; // verify the sequences
 
    assert bullspec(sys, usr) == 4; // verify the bulls
    assert cowspec(sys, usr) == 0; // verify the cows

    b, c := BullsCows(sys, usr); // calculate the bulls and cows
    //assert b == 4 && c == 0; // verify the calculation of bulls and cows
    
    // Test Same Numbers and Different Positions
    sys := [1,2,3,4]; // system selection
    usr := [4,3,2,1]; // user guess
    assert sys == [1,2,3,4] && usr == [4, 3, 2, 1]; // verify the sequences

    assert bullspec(sys, usr) == 0; // verify the bulls
    assert cowspec(sys, usr) == 4; // verify the cows

    b, c := BullsCows(sys, usr); // calculate the bulls and cows
    //assert b == 0 && c == 4; // verify the calculation of bulls and cows

    // Test Different Numbers
    sys := [1,2,3,4]; // system selection
    usr := [5,6,7,8]; // user guess
    assert sys == [1,2,3,4] && usr == [5, 6, 7, 8]; // verify the sequences

    assert bullspec(sys, usr) == 0; // verify the bulls
    assert cowspec(sys, usr) == 0; // verify the cows

    b, c := BullsCows(sys, usr); // calculate the bulls and cows
    //assert b == 0 && c == 0; // verify the calculation of bulls and cows
}