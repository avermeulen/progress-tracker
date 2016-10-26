module.exports = function(models){

    var add = function(req, res, next){
        
        const projectName = req.body.projectName;
        if (projectName){
            const project = models.Project({projectName});
            return project
                .save()
                .then(() => {
                    res.redirect(`/projects/edit/${project._id}`);
                })
                .catch((err) => next(err));
        }
        res.redirect('/projects/add')
    };

    var list = function(req, res){
        models.Project.find({})
                .then((projects) =>
                    res.render('projects/list', {projects}));

    };

    var showAdd = function(req, res, next){
        res.render('projects/add');
    };

    var edit = function(req, res){
        const project_id = req.params.project_id;

        models.Project
            .findById(project_id)
            .then((project) => {
                res.render('projects/edit', project);
            })


    }

    var addFiles = function(req, res){
        const project_id = req.params.project_id
        const fileNames = req.body.fileNames;
        console.log(project_id);

        models.Project
            .findById(project_id)
            .then((project) => {

                if (fileNames){
                    fileNames
                        .split(',')
                        .map((item) => item.trim())
                        .forEach((fileName) =>
                            project.files.push({name : fileName}));
                }

                return project
                    .save()
                    .then(() =>
                        res.redirect(`/projects/edit/${project_id}`));
            })
            .catch((err) => next(err));
    };

    const deleteFile = function(req, res){
        const project_id = req.params.project_id,
            file_id = req.params.file_id;

        models.Project
            .findById(project_id)
            .then((project) => {
                var file = project.files.id(file_id);
                file.remove()
                return project.save();
            })
            .then(() => res.redirect(`/projects/edit/${project_id}`));

    }

    return {
        add,
        deleteFile,
        edit,
        list,
        showAdd,
        addFiles
    };

};
