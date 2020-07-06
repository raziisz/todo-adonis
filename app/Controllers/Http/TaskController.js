'use strict'
const Task = use('App/Models/Task')
const { validateAll } = use('Validator')

class TaskController {
    async index({ view }) {
        const tasks = await Task.all()
        return view.render('tasks', {
          title: 'Latest tasks',
          tasks: tasks.toJSON() 
        })
    }

    async store({ request, response, session }) {
        const message = {
            'title.required': 'Required',
            'title.min': 'min 3'
        }
        const validation = await validateAll(request.all(), {
            title: 'required|min:5|max:140',
            body: 'required|min:10'
        }, message)

        if(validation.fails()) {
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }
        const { ...data } = request.only(['title', 'body']);


        const res = await Task.create(data);

        session.flash({notification: 'Task added!'});

        return response.redirect('/tasks')
    }

    async show({ params, view}) {
        const task = await Task.find(params.id)

        return view.render('detail', {
            task
        })
    }

    async destroy({params, response, session}) {
        const task = await Task.find(params.id)
        await task.delete()

        session.flash({notification: 'Task removed'})

        return response.redirect('/tasks')
    }
}

module.exports = TaskController
