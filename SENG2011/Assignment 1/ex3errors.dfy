// ex3errors.dfy in Assignment 1
// verify that an array of characters is a Palindrome

method PalVerify(a: array<char>) returns (yn: bool) // do not change
requires a.Length > 1
ensures yn == true ==> forall i :: 0 <= i <= a.Length/2 ==> a[i] == a[a.Length - i -1]
ensures yn == false ==> exists i :: 0 <= i <= a.Length/2 ==> a[i] == a[a.Length - i -1]
{
   var i:int := 0;
   while i <= a.Length/2
   invariant 0 <= i <= a.Length/2 && forall j:: 0<=j<=i ==> a[j] == a[a.Length-j-1]
   decreases i
   {                                      // do not change
      if a[i] != a[a.Length-i-1]          // do not change
      {                                   // do not change
         return false;                    // do not change
      }                                   // do not change
      i := i+1;                           // do not change
   }                                      // do not change
   return true;                           // do not change
}    