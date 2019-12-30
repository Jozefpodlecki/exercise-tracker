import homeController from './../controllers/home'
import exerciseController from './../controllers/exercise'

export default (app: any) => {

  app.post('/api/exercise/add', exerciseController.addExercise);  
  app.post('/api/exercise/new-user', exerciseController.addUser);
  app.get('/api/exercise/users', exerciseController.getUsers);
  app.get('/api/exercise/log', exerciseController.getExercises);
  
  ///api/exercise/log?{userId}[&from][&to][&limit]
  app.get("/", homeController.get);
}