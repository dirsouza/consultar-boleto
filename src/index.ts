import './config/module-alias.config'
import { app } from '@/config/app.config'
import { env } from '@/config/env.config'

app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
