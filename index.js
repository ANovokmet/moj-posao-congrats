function createInstance(name) {
    const template = q(`[data-model="${name}"]`);
    const instance = template.cloneNode(true);
    delete instance.dataset.model;
    return instance;
}

function q(selector) {
    return document.querySelector(selector)
}

const plane = q('.plane');
const cake = {
    slices: [],
    slideInDuration: 3000,
    allowInteraction: false,
    spinOutDuration: 500,
    rotation: 0,
    remove(slice) {
        this.slices = this.slices.filter(s => s !== slice);
        if (this.slices.length === 0) {
            onFinished();
        }
    },
    element: q('.cake')
}

function createSlice(options) {
    const instance = createInstance('slice');
    const instance_shadow = createInstance('slice-shadow');

    function onMouseEnter() {
        if (!cake.allowInteraction) return;

        instance.style.transform = options.transform_hover;
        instance_shadow.style.transform = options.transform_shadow_hover;

        instance.classList.add('hover');
        instance_shadow.classList.add('hover');
    }

    function onMouseLeave() {
        if (!cake.allowInteraction) return;

        instance.style.transform = options.transform;
        instance_shadow.style.transform = options.transform_shadow;

        instance.classList.remove('hover');
        instance_shadow.classList.remove('hover');
    }

    function onClick() {
        if (!cake.allowInteraction) return;

        instance.removeEventListener('mouseover', onMouseEnter);
        instance.removeEventListener('mouseleave', onMouseLeave);

        instance.classList.add('spin-out');
        instance_shadow.classList.add('spin-out');
        instance.style.transform = options.transform_spin_out;
        instance_shadow.style.transform = options.transform_shadow_spin_out;

        setTimeout(() => {
            instance.remove();
            instance_shadow.remove();
        }, cake.spinOutDuration);

        cake.rotation += 30;
        plane.style.transform = `rotateX(-24deg) rotateY(${cake.rotation}deg) rotateX(90deg) translateZ(-150px)`;
        cake.remove(instance);
    }

    instance.style.transform = options.transform;
    instance_shadow.style.transform = options.transform_shadow;

    instance.addEventListener('mouseover', onMouseEnter);
    instance.addEventListener('mouseleave', onMouseLeave);
    instance.addEventListener('click', onClick);

    cake.element.appendChild(instance);
    plane.appendChild(instance_shadow);

    return instance;
}

function onFinished() {
    plane.classList.add('finished');
    plane.style.transitionDuration = '2s';
    plane.style.transform = null;

    const plate = q('.plate');
    plate.addEventListener('click', () => { plate.classList.toggle('flip'); });
}

for (let i = 0; i < 360; i += 30) {
    const slice = createSlice({
        transform: `translateY(-50%) translateZ(150px) rotateZ(${i}deg)`,
        transform_hover: `translateY(-50%) translateZ(150px) rotateZ(${i}deg) translate3d(120px, 0, 160px)`,
        transform_shadow: `translateY(-50%) rotateZ(${i}deg) translateZ(0.1px)`,
        transform_shadow_hover: `translateY(-50%) rotateZ(${i}deg) translate3d(120px, 0, 0) translateZ(0.1px) scale(1.1)`,
        transform_spin_out: `translateY(-50%) translateZ(1200px) rotateZ(${i}deg) translateX(800px)`,
        transform_shadow_spin_out: `translateY(-50%) rotateZ(${i}deg) translate3d(800px, 0, 0) translateZ(0.1px) scale(1.5)`,
    });
    cake.slices.push(slice);
}

window.addEventListener('load', () => {
    plane.classList.add('spin-in');
    setTimeout(() => {
        cake.allowInteraction = true;
    }, cake.slideInDuration);

    document.querySelectorAll('[data-hidden]').forEach(element => {
        element.style.opacity = 1;
    });
});

function getPoint(angle, len) {
    const x = len * Math.sin(angle / 180 * Math.PI);
    const y = len * Math.cos(angle / 180 * Math.PI);
    return { x, y }
}

function createRegularPoligon(numVertices, len) {
    let result = '';
    const angle = 360 / numVertices;
    for (let i = 0; i < numVertices; i++) {
        const { x, y } = getPoint(angle * i, len);
        result += `${Math.round(x)},${Math.round(y)} `
    }
    return result;
}