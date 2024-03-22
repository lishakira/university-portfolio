//
// COMP1521 Laboratory 09 - Compile C Files
//
// compile .c files specified as command line arguments
//
// if my_program.c and other_program.c is speicified as an argument then the 
// follow two command will be executed:
// /usr/local/bin/dcc my_program.c -o my_program
// /usr/local/bin/dcc other_program.c -o other_program
//
// Authors:
// Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 10/11/2022
//

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <spawn.h>
#include <sys/types.h>
#include <sys/wait.h>

#define DCC_PATH "/usr/local/bin/dcc"

extern char **environ;

int main(int argc, char **argv)
{
    for (size_t i = 1; i < (size_t)argc; i++) {
        char *output = strdup(argv[i]);
        output[strlen(output) - 2] = '\0';
        pid_t pid;
        char *dcc_argv[] = {DCC_PATH, argv[i], "-o", output, NULL};
        
        printf("running the command: \"");
        for (char **p = dcc_argv; *p; p++) {
            printf("%s%s", p == dcc_argv ? "" : " ", *p);
        }
        
        printf("\"\n");
        posix_spawn(&pid, DCC_PATH, NULL, NULL, dcc_argv, environ);
        waitpid(pid, NULL, 0);
        free(output);
    }
    
    return EXIT_SUCCESS;
}
