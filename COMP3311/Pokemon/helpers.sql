-- COMP3311 23T1 Ass2 ... SQL helper Views/Functions
-- Add any views or functions you need into this file
-- Note: it must load without error into a freshly created Movies database
-- Note: you must submit this file even if you add nothing to it

-- The `dbpop()` function is provided for you in the dump file
-- This is provided in case you accidentally delete it

DROP TYPE IF EXISTS Population_Record CASCADE;
CREATE TYPE Population_Record AS (
	Tablename Text,
	Ntuples   Integer
);

CREATE OR REPLACE FUNCTION DBpop() RETURNS SETOF Population_Record
AS $$
DECLARE
    rec Record;
    qry Text;
    res Population_Record;
    num Integer;
BEGIN
    FOR rec IN SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename LOOP
        qry := 'SELECT count(*) FROM ' || quote_ident(rec.tablename);

        execute qry INTO num;

        res.tablename := rec.tablename;
        res.ntuples   := num;

        RETURN NEXT res;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

--
-- Example Views/Functions
-- These Views/Functions may or may not be useful to you.
-- You may modify or delete them as you see fit.
--

-- `Move_Learning_Info`
-- The `Learnable_Moves` table is a relation between Pokemon, Moves, Games and Requirements.
-- As it just consists of foreign keys, it is not very easy to read.
-- This view makes it easier to read by displaying the names of the Pokemon, Moves and Games instead of their IDs.
CREATE OR REPLACE VIEW Move_Learning_Info(Pokemon, Move, Game, Requirement) AS
SELECT
    P.Name,
    M.Name,
    G.Name,
    R.Assertion
FROM
    Learnable_Moves AS L
    JOIN
    Pokemon         AS P ON Learnt_By   = P.ID
    JOIN
    Games           AS G ON Learnt_In   = G.ID
    JOIN
    Moves           AS M ON Learns      = M.ID
    JOIN
    Requirements    AS R ON Learnt_When = R.ID
;

-- `Super_Effective`
-- This function takes a type name and
-- returns a set of all types that it is super effective against (multiplier > 100)
-- eg Water is super effective against Fire, so `Super_Effective('Water')` will return `Fire` (amongst others)
CREATE OR REPLACE FUNCTION Super_Effective(_Type Text) RETURNS SETOF Text
AS $$
SELECT
    B.Name
FROM
    Types              AS A
    JOIN
    Type_Effectiveness AS E ON A.ID = E.Attacking
    JOIN
    Types              AS B ON B.ID = E.Defending
WHERE
    A.Name = _Type
    AND
    E.Multiplier > 100
$$ LANGUAGE SQL;

--
-- Your Views/Functions Below Here
-- Remember This file must load into a clean Pokemon database in one pass without any error
-- NOTICEs are fine, but ERRORs are not
-- Views/Functions must be defined in the correct order (dependencies first)
-- eg if my_supper_clever_function() depends on my_other_function() then my_other_function() must be defined first
-- Your Views/Functions Below Here
--

-- Finds the Type/s of the Pokemon
-- Used in: my_pokemon and encounter_summary
CREATE OR REPLACE FUNCTION 
	Find_Types(Pokemon_Name TEXT, Concatenator TEXT) RETURNS TEXT
AS
$$
DECLARE
	Rec RECORD;
	Types TEXT := '';
	
BEGIN
	SELECT TF.Name AS First_Type, TS.Name AS Second_Type
		INTO Rec
		FROM Pokemon P
			JOIN Types TF ON P.First_Type = TF.ID
			LEFT JOIN Types TS ON P.Second_Type = TS.ID
		WHERE P.Name = Pokemon_Name;
	
	IF (Rec.Second_Type is NULL) THEN
		Types = CONCAT(Types, Rec.First_Type);
	ELSE
		Types = CONCAT(Types, Rec.First_Type, Concatenator, Rec.Second_Type);
	END IF;
	
	RETURN Types;
END;
$$ LANGUAGE plpgsql;

-- Finds all the Egg Groups the Pokemon is part of
-- Used in: encounter_summary
CREATE OR REPLACE FUNCTION 
	Find_Egg_Groups(Pokemon_Name TEXT) RETURNS TEXT
AS
$$
DECLARE
	Rec RECORD;
	Egg_Groups TEXT := '';
	
BEGIN
	FOR Rec IN SELECT EG.Name
		FROM Egg_Groups EG
		    JOIN In_Group IG ON EG.ID = IG.Egg_Group
		    JOIN Pokemon P ON IG.Pokemon = P.ID
		WHERE P.Name = Pokemon_Name
		ORDER BY EG.Name ASC
	LOOP
		IF (Egg_Groups = '') THEN
			Egg_Groups = CONCAT(Egg_Groups, Rec.Name);
		ELSE 
			Egg_Groups = CONCAT(Egg_Groups, ', ', Rec.Name);
		END IF;
	END LOOP;
	
	RETURN Egg_Groups;
END;
$$ LANGUAGE plpgsql;

-- Finds all the Abilities the Pokemon has that are not hidden
CREATE OR REPLACE FUNCTION 
	Find_Abilities(Pokemon_Name TEXT) RETURNS TEXT
AS
$$
DECLARE
	Rec RECORD;
	Abilities TEXT := '';
	
BEGIN
	FOR Rec IN SELECT A.Name
		FROM Abilities A
		    JOIN Knowable_Abilities KA ON A.ID = KA.Knows
		    JOIN Pokemon P on KA.Known_By = P.ID
		WHERE P.Name = Pokemon_Name AND KA.Hidden = False
		ORDER BY A.Name ASC
	LOOP
		IF (Abilities = '') THEN
			Abilities = CONCAT(Abilities, Rec.Name);
		ELSE 
			Abilities = CONCAT(Abilities, ', ', Rec.Name);
		END IF;
	END LOOP;
	
	RETURN Abilities;
END;
$$ LANGUAGE plpgsql;

-- Finds all the Requirements the Encounter requires
-- Used in: encounter_summary
CREATE OR REPLACE FUNCTION 
	Find_Requirements(E_ID INTEGER, Location TEXT, Game TEXT) RETURNS TEXT
AS
$$
DECLARE
	Rec RECORD;
	Requirements TEXT := '';
	
BEGIN
	FOR Rec IN SELECT E.ID, R.Assertion, ER.Inverted
	    FROM Encounters E
		     JOIN Locations L ON E.Occurs_At = L.ID
		     JOIN Games G ON L.Appears_In = G.ID
		     JOIN Encounter_Requirements ER ON E.ID = ER.Encounter
		     JOIN Requirements R ON ER.Requirement = R.ID
		WHERE E.ID = E_ID AND L.Name = Location AND G.Name = Game
		ORDER BY R.Assertion ASC
	LOOP
	    IF (Requirements = '') THEN
		    IF (Rec.Inverted = True) THEN
	            Requirements = CONCAT(Requirements, 'NOT ', Rec.Assertion);
	        ELSE
	            Requirements = CONCAT(Requirements, Rec.Assertion);
	        END IF;
		ELSE 
		    IF (Rec.Inverted = True) THEN
	            Requirements = CONCAT(Requirements, e'\n\t\t\t', 'NOT ', Rec.Assertion);
	        ELSE
	            Requirements = CONCAT(Requirements, e'\n\t\t\t', Rec.Assertion);
	        END IF;
		END IF;
	END LOOP;
	
	RETURN Requirements;
END;
$$ LANGUAGE plpgsql;

--- Calculates the average density of all Pokemon in the Location
--- Used in: pokemon_density
CREATE OR REPLACE FUNCTION 
	Location_Density(Region_Name Regions, Location_Name TEXT) RETURNS DECIMAL
AS
$$
DECLARE
	Rec RECORD;
	Density DECIMAL := 0.0;
	Num_Games DECIMAL := 0.0;
	
BEGIN
	SELECT DISTINCT L.Name, SUM(((P.Average_Weight * 1000.0) / ((4.0 / 3.0) * 
		Pi() * ((((P.Average_Height / 2.0) * 100.0))^3.0))) * (E.Rarity / 100.0)) 
		AS Density, COUNT(DISTINCT G.ID) AS Num_Games
		INTO Rec
		FROM Encounters E 
			JOIN Pokemon P ON E.Occurs_With = P.ID
			JOIN Locations L ON E.Occurs_At = L.ID
			JOIN Games G ON L.Appears_In = G.ID
		WHERE G.Region = Region_Name AND L.Name = Location_Name
		GROUP BY L.Name;
	
	Density = Rec.Density / Rec.Num_Games;
	SELECT ROUND(Density, 4) INTO Density;
	
	RETURN Density;
END;
$$ LANGUAGE plpgsql;

--- Calculates the damage of the attack made by the attacking Pokemon
--- Used in: attack_damage
CREATE OR REPLACE FUNCTION 
	Calculate_Damage(Move TEXT, Attacking_Pokemon TEXT, Defending_Pokemon TEXT,
			   Damage TEXT) RETURNS INT
AS
$$
DECLARE
	Rec RECORD;
	Attacker_Level DECIMAL := 1.0;
	Attack_Power DECIMAL := 1.0;
	Attacker_Attack DECIMAL := 1.0;
	Defender_Defense DECIMAL := 1.0;
	Random_Factor DECIMAL := 0.85;
	STAB DECIMAL := 1.0;
	Type_Effectiveness DECIMAL := 1.0;
	Calculated_Damage DECIMAL := 0.0;
	Final_Damage INT := 0;
	
BEGIN
	SELECT DISTINCT ON (M.ID) M.Power AS Attack_Power,
		CASE M.Category
			WHEN 'Special'
				THEN (P.Base_Stats).Special_Attack
			ELSE (P.Base_Stats).Attack
		END AS Attacker_Attack,
		CASE M.Category
			WHEN 'Special'
				THEN (SELECT (P.Base_Stats).Special_Defense
						FROM Pokemon P
						WHERE P.Name = Defending_Pokemon)
			ELSE (SELECT (P.Base_Stats).Defense
					FROM Pokemon P
					WHERE P.Name = Defending_Pokemon)
		END AS Defender_Defense,
		CASE
			WHEN M.Of_Type IN (P.First_Type, P.Second_Type)
				THEN 1.5
			ELSE 1.0
		END AS STAB,
        (SELECT DISTINCT TE.Multiplier
                	FROM Type_Effectiveness TE
                        JOIN Moves M ON TE.Attacking = M.Of_Type
                        JOIN Types T ON TE.Defending = T.ID
                        JOIN Pokemon P ON T.ID = P.First_Type
                	WHERE M.Name = Move AND P.Name = Defending_Pokemon)
        AS First_Multiplier,
        (SELECT DISTINCT TE.Multiplier
                	FROM Type_Effectiveness TE
                        JOIN Moves M ON TE.Attacking = M.Of_Type
                        JOIN Types T ON TE.Defending = T.ID
                        JOIN Pokemon P ON T.ID = P.Second_Type
                	WHERE M.Name = Move AND P.Name = Defending_Pokemon)
        AS Second_Multiplier
		INTO Rec
		FROM Moves M
			JOIN Learnable_Moves LM ON M.ID = LM.Learns
			JOIN Pokemon P ON LM.Learnt_By = P.ID
		WHERE M.Name = Move AND P.Name = Attacking_Pokemon;
		
	IF Damage = 'Maximum' THEN 
		Attacker_Level = 100.0;
		Random_Factor = 1.0;
	END IF;
	
	Attack_Power = Rec.Attack_Power;
	Attacker_Attack = Rec.Attacker_Attack;
	Defender_Defense = Rec.Defender_Defense;
	STAB = Rec.STAB;
	
	IF Rec.First_Multiplier is NULL THEN
		Rec.First_Multiplier = 100.0;
	END IF;
	IF Rec.Second_Multiplier is NULL THEN
		Rec.Second_Multiplier = 100.0;
	END IF;
		
	Type_Effectiveness = (Rec.First_Multiplier / 100.0) * (Rec.Second_Multiplier / 100.0);
	
	Calculated_Damage = ((((((2.0 * Attacker_Level) / 5.0) + 2.0) * Attack_Power * 
			      (Attacker_Attack / Defender_Defense)) / 50.0) + 2.0) * 
			      Random_Factor * STAB * Type_Effectiveness;
	
	SELECT TRUNC(ROUND(Calculated_Damage, 1)) INTO Final_Damage;
	
	RETURN Final_Damage;
END;
$$ LANGUAGE plpgsql;
