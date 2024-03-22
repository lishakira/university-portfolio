//
// COMP1521 Laboratory 09 - Print File Modes
//
// print one line for each pathnames which gives the permissions 
// of the file or directory
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
#include <unistd.h> 
#include <sys/types.h> 
#include <sys/stat.h> 
#include <string.h>


int main(int argc, char *argv[]) {
    for (int i = 1; i < argc; i++) {
        char *pathname = argv[i];
        struct stat s;
        if (stat(pathname, &s) != 0) { 
            perror(pathname); 
            return 1;
        }
           
        mode_t mode = s.st_mode;
        char permissions[] = "?rwxrwxrwx";
        if (S_ISREG(mode)) { 
            permissions[0] = '-';
        } else if (S_ISDIR(mode)) { 
            permissions[0] = 'd';
        }

        for (int j = 1; j < strlen(permissions); j++) { 
            if (!(mode & (1 << (j- 1)))) {
                permissions[strlen(permissions) - j] = '-';
            }
        }

        printf("%s %s\n", permissions, pathname);
    }

    return 0;
}