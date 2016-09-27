import Glue from 'glue';
import manifest from './manifest';

const composeOptions = {
    relativeTo: `${process.cwd()}/src/plugins`
};

export default Glue.compose.bind(Glue, manifest.get('/'), composeOptions);
