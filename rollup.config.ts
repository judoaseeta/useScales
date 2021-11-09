import { defineConfig } from 'rollup'

const config = defineConfig({
    input: 'src/index.ts',
    output :{
        dir: 'build',
        format: 'es'
    },
    external: [
        'react',
        'd3-scale'
    ]
})

export default config