// ex5.dfy
// Shakira Li (z5339356)

method Female(n:int) returns (m: int)
decreases n, 1
{
    if n == 0 
    {
        return 1;
    }

    if n > 0
    {
        m := Male(n - 2);
    }
}

method Male(n:int) returns (m: int)
decreases n, 2
{
    if n == 0
    {
        return 0;
    }

    if n > 0 
    {
        m := Female(n - 1);
    }
}