-- COMP3311 23T1 Assignment 1

-- Q1: amount of alcohol in the best beers

-- put any Q1 helper views/functions here

create or replace view Q1(beer, "sold in", alcohol)
as
select B.name, CONCAT(B.volume, 'ml ', B.sold_in), 
	CAST(B.volume * B.ABV / 100 as numeric(4, 1)) || 'ml' 
	from Beers B 
	where B.rating > 9
;

-- Q2: beers that don't fit the ABV style guidelines

-- put any Q2 helper views/functions here

create or replace view Q2(beer, style, abv, reason)
as
select B.name, S.name, B.ABV::ABVvalue, 
	case
		when S.min_abv > B.ABV 
			then 'too weak by ' || 
			CAST(abs(S.min_abv - B.ABV) as numeric(4, 1)) || '%'
		when S.max_abv < B.ABV
			then 'too strong by ' || 
			CAST(abs(S.max_abv - B.ABV) as numeric(4, 1)) || '%'
	end
	from Styles S join Beers B on S.id = B.style
	where S.min_abv > B.ABV or S.max_abv < B.ABV
;

-- Q3: Number of beers brewed in each country

-- put any Q3 helper views/functions here

create or replace view Q3(country, "#beers")
as
select C.name, count(B)::bigint
	from Countries C left join Locations L on C.id = L.within
			   left join Breweries Br on L.id = Br.located_in
			   left join Brewed_by BB on Br.id = BB.brewery
			   left join Beers B on BB.beer = B.id
	group by C.name
;

-- Q4: Countries where the worst beers are brewed

-- put any Q4 helper views/functions here

create or replace view Q4(beer, brewery, country)
as
select B.name, Br.name, C.name
	from Countries C join Locations L on C.id = L.within
			   join Breweries Br on L.id = Br.located_in
			   join Brewed_by BB on Br.id = BB.brewery
			   join Beers B on BB.beer = B.id
	where B.rating < 3
;

-- Q5: Beers that use ingredients from the Czech Republic

-- put any Q5 helper views/functions here

create or replace view Q5(beer, ingredient, "type")
as
select B.name, I.name, I.itype::IngredientType
	from Countries C join Ingredients I on C.id = I.origin
			   join Contains CI on I.id = CI.ingredient
			   join Beers B on CI.beer = B.id
	where C.name = 'Czech Republic'
;

-- Q6: Beers containing the most used hop and the most used grain

-- put any Q6 helper views/functions here

-- finds all the ingredients with the type 'hop' in the database
create or replace view Hop(hop_name, nbeers)
as
select I.name, count(B.id)
	from Ingredients I join Contains CI on I.id = CI.ingredient
			     join Beers B on CI.beer = B.id
	where I.itype = 'hop'
	group by I.name;

-- finds the most popular hop used in beers in the database
create or replace view Pop_hop(hop_name)
as
select hop_name
	from Hop
	where nbeers = (select max(nbeers) from Hop);

-- finds all the ingredients with the type 'grain' in the database
create or replace view Grain(grain_name, nbeers)
as
select I.name, count(B.id)
	from Ingredients I join Contains CI on I.id = CI.ingredient
			     join Beers B on CI.beer = B.id
	where I.itype = 'grain'
	group by I.name;

-- finds the most popular grain used in beers in the database
create or replace view Pop_grain(grain_name)
as
select grain_name
	from Grain
	where nbeers = (select max(nbeers) from Grain);

--finds all the beers that use both the most popular hop and grain
create or replace view Q6(beer)
as
select B.name
	from Ingredients I join Contains CI on I.id = CI.ingredient
			     join Beers B on CI.beer = B.id
	where I.itype = 'hop' and I.name in (select hop_name from Pop_hop)
	
intersect

select B.name
	from Ingredients I join Contains CI on I.id = CI.ingredient
			     join Beers B on CI.beer = B.id
	where I.itype = 'grain' and I.name in (select grain_name from Pop_grain)
;


-- Q7: Breweries that make no beer

-- put any Q7 helper views/functions here

create or replace view Q7(brewery)
as
select Br.name
	from Breweries Br left join Brewed_by BB on Br.id = BB.brewery
			    left join Beers B on BB.beer = B.id
	group by Br.name
	having count(B) = 0
;

-- Q8: Function to give "full name" of beer

-- put any Q8 helper views/functions here

create or replace function
	Q8(beer_id integer) returns text
as
$$
declare
	result text := '';
	beer text := '';
	brewery text := '';
	rec RECORD;
	
begin
	-- finds the beer name with the given beer_id
	select B.name into beer 
		from Beers B 
		where B.id = beer_id;
	
	-- if no such beer exists, returns 'No such beer'
	if (NOT FOUND) then
		return 'No such beer';
	end if;
		
	-- finds the brewery(-ies) with the given beer_id
	for rec in select Br.name 
		from Breweries Br join Brewed_by BB on Br.id = BB.brewery
				    join Beers B on BB.beer = B.id
		where BB.beer = beer_id
	loop
		if (brewery != '') then
			brewery = CONCAT(brewery, ' + ');
		end if;
		
		select REGEXP_REPLACE(rec.name, ' (Beer|Brew).*$', '') into rec.name;
		
		brewery = brewery || rec.name;
	end loop;
		
	result = CONCAT(brewery, ' ', beer);
	
	return result;
end;
$$ language plpgsql
;

-- Q9: Beer data based on partial match of beer name

drop type if exists BeerData cascade;
create type BeerData as (beer text, brewer text, info text);


-- put any Q9 helper views/functions here

-- finds all the beers that match the partial_name
create or replace function
	BeerMatch(partial_name text) returns setof integer
as
$$
declare
	rec RECORD;
	
begin
	for rec in select B.id
		from Beers B
		where lower(B.name) like '%'||lower(partial_name)||'%'
	loop
		return next rec.id;
	end loop;
end;
$$ language plpgsql;
	
-- finds the brewery(-ies) that match the beer_id
create or replace function
	Brewery(beer_id integer) returns text
as
$$
declare 
	rec RECORD;
	brewery text := '';
	
begin	
	for rec in select Br.name 
		from Breweries Br join Brewed_by BB on Br.id = BB.brewery
				    join Beers B on BB.beer = B.id
		where B.id = beer_id
	loop
		if (brewery != '') then
			brewery = brewery || ' + ';
		end if;
		
		brewery = brewery || rec.name;
	end loop;
	
	return brewery;
end;
$$ language plpgsql;

-- finds the hop ingredients of the beer using beer_id
create or replace function 
	Hops(beer_id integer) returns text
as
$$
declare
	rec RECORD;
	hops text := '';
	
begin
	for rec in select I.name
		from Ingredients I join Contains CI on I.id = CI.ingredient
			     join Beers B on CI.beer = B.id
		where B.id = beer_id and I.itype = 'hop'
		order by I.name ASC
	loop
		if (hops = '') then
			hops = CONCAT(hops, 'Hops: ', rec.name);
		else 
			hops = CONCAT(hops, ',', rec.name);
		end if;
	end loop;
	
	return hops;
end;
$$ language plpgsql;

-- finds the grain ingredients of the beer using beer_id
create or replace function 
	Grain(beer_id integer) returns text
as
$$
declare
	rec RECORD;
	grain text := '';
	
begin
	for rec in select I.name
		from Ingredients I join Contains CI on I.id = CI.ingredient
			     join Beers B on CI.beer = B.id
		where B.id = beer_id and I.itype = 'grain'
		order by I.name ASC
	loop
		if (grain = '') then
			grain = CONCAT(grain, 'Grain: ', rec.name);
		else 
			grain = CONCAT(grain, ',', rec.name);
		end if;
	end loop;
	
	return grain;
end;
$$ language plpgsql;

-- finds the extra/adjunct ingredients of the beer using beer_id
create or replace function 
	Extras(beer_id integer) returns text
as
$$
declare
	rec RECORD;
	extras text := '';
	
begin
	for rec in select I.name
		from Ingredients I join Contains CI on I.id = CI.ingredient
			     join Beers B on CI.beer = B.id
		where B.id = beer_id and I.itype = 'adjunct'
		order by I.name ASC
	loop
		if (extras = '') then
			extras = CONCAT(extras, 'Extras: ', rec.name);
		else 
			extras = CONCAT(extras, ',', rec.name);
		end if;
	end loop;
	
	return extras;
end;
$$ language plpgsql;

-- compiles all the ingredients into one text
create or replace function
	Info(beer_id integer) returns text
as
$$
declare
	hops text := '';
	grain text := '';
	extras text := '';
	result text := '';

begin
	hops = Hops(beer_id);
	grain = Grain(beer_id);
	extras = Extras(beer_id);
	
	if (hops != '') then
		result = CONCAT(result, hops);
		if (grain != '' or extras != '') then
			result = CONCAT(result, e'\n');
		end if;
	end if;
	
	if (grain != '') then
		result = CONCAT(result, grain);
		if (extras != '') then
			result = CONCAT(result, e'\n');
		end if;
	end if;
	
	if (extras != '') then
		result = CONCAT(result, extras);
	end if;
	
	return result;
end;
$$ language plpgsql;

-- finds the information of the beers that match partial_name
create or replace function
	Q9(partial_name text) returns setof BeerData
as
$$
declare
	rec RECORD;
	result BeerData;
	
begin
	for rec in select * 
		from BeerMatch(partial_name)
	loop
		result.beer = (select B.name 
					from Beers B
					where B.id = rec.BeerMatch);
		result.brewer = Brewery(rec.BeerMatch);
		result.info = Info(rec.BeerMatch);
		
		return next result;
	end loop;
end;
$$ language plpgsql
;

