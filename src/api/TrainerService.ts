export interface Trainer {
    name: string;
    surname: string;
    profile_picture: string;
}

const mockTrainer: Trainer = {
    name: "Hans Dieter",
    surname: "Flick",
    profile_picture: "https://www.directvsports.com/__export/1725911740649/sites/dsports/img/2024/09/09/flick.png_554985492.png"
};

export const TrainerService = {
    getTrainerProfile: (): Promise<Trainer> => {
        return Promise.resolve(mockTrainer);
    }
};