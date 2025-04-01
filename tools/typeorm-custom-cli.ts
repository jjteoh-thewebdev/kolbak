// https://github.com/typeorm/typeorm/issues/9122#issuecomment-1160347397
// workaround for working with typeorm in a monorepo setup
import { register } from 'ts-node'

register({ transpileOnly: true })

import 'typeorm/cli'