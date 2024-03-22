//
// COMP1521 Lab 01 Exercise - Statistical Analysis of Command Line Arguments
//
// prints the following information:
// 1. minimum and maximum values
// 2. sum and product of all the values
// 3. mean of all the values
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 20/09/2022
//

#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
	if (argc == 1) {
		printf("Usage: ./arg_stats NUMBER [NUMBER ...]\n");
		return 0;
	}

	int min = atoi(argv[1]), max = atoi(argv[1]);
	int sum = 0, product = 1;
	for (int i = 1; i < argc; i++) {
		if (min >= atoi(argv[i])) {
			min = atoi(argv[i]);
		}

		if (max <= atoi(argv[i])) {
			max = atoi(argv[i]);
		} 

		sum += atoi(argv[i]);
		product *= atoi(argv[i]);
	}

	printf("MIN:  %d\n", min);
	printf("MAX:  %d\n", max);
	printf("SUM:  %d\n", sum);
	printf("PROD: %d\n", product);
	printf("MEAN: %d\n", sum / (argc - 1));

	return 0;
}
