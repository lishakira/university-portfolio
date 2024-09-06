/**
 * The dataStore below will be used in the autotest, which you can run with:
 *     $ bash autotest.sh
 * You can modify this if you want to do your own testing.
 *
 * We will be using a modified dataStore in the automarking - see the
 * "Testing" section the specification.
 */
const dataStore = {
  academics: [
    {
      id: 10,
      name: 'Ada',
      hobby: 'music',
    },
    {
      id: 20,
      name: 'Ben',
      hobby: 'gym',
    },
    {
      id: 30,
      name: 'Cid',
      hobby: 'chess',
    },
    {
      id: 40,
      name: 'Dan',
      hobby: 'art',
    },
    {
      id: 50,
      name: 'Eve',
      hobby: 'yoga',
    },
  ],

  courses: [
    {
      id: 1511,
      name: 'COMP1511',
      description: 'Programming Fundamentals',
      staff_ids: [10, 20],
      member_ids: [10, 20, 30, 40, 50],
    },
    {
      id: 1521,
      name: 'COMP1521',
      description: 'Computer Systems Fundamentals',
      staff_ids: [20],
      member_ids: [20, 40, 50],
    },
    {
      id: 1531,
      name: 'COMP1531',
      description: 'Software Engineering Fundamentals',
      staff_ids: [20, 30],
      member_ids: [20, 30, 10, 40],
    },
  ],
};

/**
 * Returns an object with information about the number of academics in the dataStore.
 *
 * @returns {{numAcademics: number}} object
 */
function getNumAcademics() {
  // TODO: Observe the return object, then replace with your implementation
  // to work on dataStores with a different number of academics and courses.

  let academicsValue = 0; 
  while (dataStore.academics[academicsValue] != null) {
    academicsValue++;
  }

  return {
    numAcademics: academicsValue,
  };
}

/**
 * Returns an object with information about the number of courses in the dataStore.
 *
 * @returns {{numCourses: number}}
 */
function getNumCourses() {
  // TODO: Observe the return object, then replace with your implementation
  // to work on dataStores with a different number of academics and courses.

  let coursesValue = 0; 
  while (dataStore.courses[coursesValue] != null) {
    coursesValue++;
  }

  return {
    numCourses: coursesValue,
  };
}

/**
 * Returns an academic object that corresponds to the given id
 * Return { error: 'error' } on error
 *
 * @param {number} academicId - unique identifier for an academic.
 * @returns {{academic: {name: string, hobby: string}}}
 */
function getAcademicDetailsFromId(academicId) {
  // TODO: Observe the return object, then replace with your implementation
  // to work on dataStores with a different number of academics and courses.
  
  for (const academic of dataStore.academics) {
    if (academic.id === academicId) {
      return {
        academic: {
          name: academic.name,
          hobby: academic.hobby,
        }
      };
    }
  }

  return {
    error: 'error',
  };
}

/**
 * Returns a course object that corresponds to the given id
 * Return { error: 'error' } on error
 *
 * @param {number} courseId - unique identifier for a course.
 * @returns {{course: {name: string, description: string}}}
 */
function getCourseDetailsFromId(courseId) {
  // TODO: Observe the return object, then replace with your implementation
  // to work on dataStores with a different number of academics and courses.

  for (const course of dataStore.courses) {
    if (course.id === courseId) {
      return {
        course: {
          name: course.name,
          description: course.description,
        }
      };
    }
  }

  return {
    error: 'error',
  };
}

/**
 * Returns an object that contains information about whether an academic is a
 * member of the given course.
 * Return { error: 'error' } on error
 *
 * @param {number} academicId - unique indentifier for an academic
 * @param {number} courseId - unique identifier for a course
 * @returns {{isMember: boolean}}
 */
function checkAcademicIsMember(academicId, courseId) {
  // TODO: Observe the return object, then replace with your implementation
  // to work on dataStores with a different number of academics and courses.

  const academic = dataStore.academics.find(a => a.id === academicId);
  const course = dataStore.courses.find(c => c.id === courseId);
  if (academic === undefined || course === undefined) {
    return ERROR;
  }
  return {
    isMember: course.member_ids.includes(academicId)
  };  
}

/**
 * Returns an object that contains information about whether an academic is a
 * member of the given course.
 * Return { error: 'error' } on error
 *
 * @param {number} academicId - unique indentifier for an academic
 * @param {number} courseId - unique identifier for a course
 * @returns {{isStaff: Boolean}}
 */
function checkAcademicIsStaff(academicId, courseId) {
  // TODO: Observe the return object, then replace with your implementation
  // to work on dataStores with a different number of academics and courses.

  const academic = dataStore.academics.find(a => a.id === academicId);
  const course = dataStore.courses.find(c => c.id === courseId);
  if (academic === undefined || course === undefined) {
    return ERROR;
  }
  return {
    isStaff: course.staff_ids.includes(academicId)
  };
}

/**
 * You will not be able to compare two objects with `===`. For this week,
 * you can simply console.log() the output and view it manually.
 */
console.log('1. numAcademics()');
console.log('Expect: { numAcademics: 5 }');
console.log('Output:', getNumAcademics());
console.log();

console.log('2. numCourses()');
console.log('Expect: { numCourses: 3 }');
console.log('Output:', getNumCourses());
console.log();

console.log('3. getAcademicDetailsFromId(10)');
console.log("Expect: { academic: { name: 'Ada', hobby: 'music' } }");
console.log('Output:', getAcademicDetailsFromId(10));
console.log();

console.log('4. getAcademicDetailsFromId(999999)');
console.log("Expect: { error: 'error' }");
console.log('Output:', getAcademicDetailsFromId(999999));
console.log();

console.log('// TODO: You can add more debugging console.log here.');