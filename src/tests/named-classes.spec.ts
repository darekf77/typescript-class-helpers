import * as _ from 'lodash';
import { describe, before } from 'mocha'
import { expect } from 'chai';
import { CLASS } from '../index';




@CLASS.NAME('Project')
class Project {

}

class ProjectWithoutName {

}


class AngularProject extends Project {

}

class AngularCLientPorject extends AngularProject {

}

describe('CLASS inheritance naming', () => {

  it('should recognize named entities', () => {

    let project = new Project()
    expect(CLASS.OBJECT(project).isClassObject).to.be.true;

    let angularProject = new AngularProject();
    expect(CLASS.OBJECT(angularProject).isClassObject).to.be.true;

    let angularClientProject = new AngularProject();
    expect(CLASS.OBJECT(angularClientProject).isClassObject).to.be.true;

    expect(CLASS.OBJECT(new Date()).isClassObject).to.be.true;

  });


  it('should not recognize named entities', () => {



    let projectWithoutName = new ProjectWithoutName()
    expect(CLASS.OBJECT(projectWithoutName).isClassObject).to.be.true;

    expect(CLASS.OBJECT({}).isClassObject).to.be.false;

    expect(CLASS.OBJECT(new Object()).isClassObject).to.be.false;

  });



});
