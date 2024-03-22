// ex4.dfy
// Shakira Li (z5339356)

method Forbid42(x:int, y:int) returns (z: int)
requires y != 42
ensures z == x/(42-y)
{
    var temp:int := 42-y;
    z := x/temp;    
}

method Allow42(x:int, y:int) returns (z: int, err:bool)
ensures if y == 42 then err == true else err == false
ensures if y == 42 then z == 0 else z == x/(42-y)
{
    if y == 42
    {
        return 0, true;
    }

    z := Forbid42(x,y);
    
    return z, false;
}

method Forbid42Tester() {
    var c:int := Forbid42(0, 1);
    assert c == 0;

    c := Forbid42(10, 32);
    assert c == 1;

    c := Forbid42(-100, 38);
    assert c == -25;
}

method Allow42Tester() {
    var c:int, err:bool := Allow42(0, 42);
    assert c == 0;
    assert err == true;

    c, err := Allow42(-10, 42);
    assert c == 0;
    assert err == true;

    c, err := Allow42(0, 1);
    assert c == 0;
    assert err == false;

    c, err := Allow42(10, 32);
    assert c == 1;
    assert err == false;

    c, err := Allow42(-100, 38);
    assert c == -25;
    assert err == false;
}