export default class Recipe {

    public constructor(
        public name: string,
        private chef_: string,
        public imageURL?: string,
        public isUserMade?: boolean,
    ) { }

    public get chef(): string {
        return this.isUserMade ? "You" : this.chef_;
    }

}