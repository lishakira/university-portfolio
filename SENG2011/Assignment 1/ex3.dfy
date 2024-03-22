// ex3errors.dfy 
// Shakira Li (z5339356)

method PalVerify(a: array<char>) returns (yn: bool) // do not change
requires a.Length >= 0
ensures yn == false ==> exists j | 0<=j<a.Length/2 :: a[j] != a[a.Length-j-1]
ensures yn == true ==> forall j | 0<=j<a.Length/2 :: a[j] == a[a.Length-j-1]
{
   var i:int := 0;
   while i < a.Length/2
   invariant 0 <= i <= a.Length && forall j | 0<=j<i :: a[j] == a[a.Length-j-1]
   {                                      // do not change
      if a[i] != a[a.Length-i-1]          // do not change
      {                                   // do not change
         return false;                    // do not change
      }                                   // do not change
      i := i+1;                           // do not change
   }                                      // do not change
   return true;                           // do not change
}    

method Tester() {
   var a := new char[]['r','e','f','e','r'];
   var b := PalVerify(a);
   assert b == true;

   a := new char[]['z'];
   b := PalVerify(a);
   assert b == true;

   a := new char[][];
   b := PalVerify(a);
   assert b == true;

   a := new char[]['x','y'];
   b := PalVerify(a);
   //assert b == false;

   a := new char[]['1','2','3','4','2','1'];
   b := PalVerify(a);
   //assert b == false;
}