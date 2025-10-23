export const rootResolver = {
  workflow: () => {
    return [
      {
        id: "1",
        name: "Sample Workflow",
        definition: { steps: ["start", "process", "end"] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  },
};
